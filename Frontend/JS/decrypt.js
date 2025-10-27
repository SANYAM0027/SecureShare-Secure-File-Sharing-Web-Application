document.addEventListener('DOMContentLoaded', () => {
    const decryptForm = document.getElementById('decrypt-form');
    // FIX: Uses 'decryptFileInput' to match your HTML
    const decryptFileInput = document.getElementById('decryptFileInput');
    const decryptPassword = document.getElementById('decrypt-password');
    const decryptFileName = document.getElementById('decrypt-file-name');
    const decryptButton = document.getElementById('decrypt-button');
    const decryptStatus = document.getElementById('decrypt-status');

    // Update file name display
    decryptFileInput.addEventListener('change', () => {
        if (decryptFileInput.files.length > 0) {
            decryptFileName.textContent = decryptFileInput.files[0].name;
            decryptFileName.classList.remove('text-gray-500');
            decryptFileName.classList.add('text-gray-300');
        } else {
            decryptFileName.textContent = 'no files selected';
            decryptFileName.classList.add('text-gray-500');
            decryptFileName.classList.remove('text-gray-300');
        }
    });

    // Handle decryption form submission
    decryptForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = decryptFileInput.files[0];
        const password = decryptPassword.value;

        if (!file || !password) {
            showStatus(decryptStatus, 'Please select a file and enter a password.', false);
            return;
        }

        const originalButtonText = decryptButton.innerHTML;
        decryptButton.disabled = true;
        showStatus(decryptStatus, 'Decrypting file...', true);

        try {
            // 1. Read the entire encrypted file as an ArrayBuffer
            const fileBuffer = await file.arrayBuffer();
            
            // --- NEW BUFFER LOGIC ---
            // 2. Create ONE Uint8Array view of the entire file
            const fileBytes = new Uint8Array(fileBuffer);

            // 3. Extract salt and iv as Uint8Arrays (this is a view, not a copy)
            const salt = fileBytes.slice(0, 16);
            const iv = fileBytes.slice(16, 28);

            // 4. Extract metadata length
            // We read from the original buffer at offset 28 for 4 bytes
            const metaLengthView = new DataView(fileBuffer, 28, 4);
            const metaLength = metaLengthView.getUint32(0, true); // true for little-endian

            // 5. Extract metadata
            const metaBytes = fileBytes.slice(32, 32 + metaLength);
            const metadataJSON = new TextDecoder().decode(metaBytes);
            const metadata = JSON.parse(metadataJSON);
            
            // 6. Extract the encrypted data as a Uint8Array
            const encryptedData = fileBytes.slice(32 + metaLength);
            // --- END NEW BUFFER LOGIC ---

            // 7. Derive the *same* key
            const key = await deriveKey(password, salt);
            
            // 8. Decrypt the data (passing a Uint8Array is valid)
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                encryptedData
            );
            
            // 9. Create a Blob with the CORRECT file type
            const blob = new Blob([decryptedData], { type: metadata.type || 'application/octet-stream' });
            
            // 10. Use the ORIGINAL file name
            const decryptedFileName = metadata.name || 'decrypted-file';
                
            downloadFile(blob, decryptedFileName);
            
            showStatus(decryptStatus, 'Decryption successful! Downloading...', false);

        } catch (err) {
            console.error(err);
            // This error most often means the password was wrong
            if (err.name === 'OperationError') {
                showStatus(decryptStatus, 'Error: Decryption failed. Check your password.', false);
            } else {
                showStatus(decryptStatus, `Error: ${err.message}`, false);
            }
        } finally {
            decryptButton.disabled = false;
            decryptButton.innerHTML = originalButtonText;
            // Clear status after 5 seconds
            setTimeout(() => showStatus(decryptStatus, '', false), 5000);
        }
    });
});

