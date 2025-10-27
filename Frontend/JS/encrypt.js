document.addEventListener('DOMContentLoaded', () => {
    const encryptForm = document.getElementById('encrypt-form');
    // FIX: Uses 'encryptFileInput' to match your HTML
    const encryptFileInput = document.getElementById('encryptFileInput');
    const encryptPassword = document.getElementById('encrypt-password');
    const encryptFileName = document.getElementById('encrypt-file-name');
    const encryptButton = document.getElementById('encrypt-button');
    const encryptStatus = document.getElementById('encrypt-status');

    // Update file name display
    encryptFileInput.addEventListener('change', () => {
        if (encryptFileInput.files.length > 0) {
            encryptFileName.textContent = encryptFileInput.files[0].name;
            encryptFileName.classList.remove('text-gray-500');
            encryptFileName.classList.add('text-gray-300');
        } else {
            encryptFileName.textContent = 'no files selected';
            encryptFileName.classList.add('text-gray-500');
            encryptFileName.classList.remove('text-gray-300');
        }
    });

    // Handle encryption form submission
    encryptForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = encryptFileInput.files[0];
        const password = encryptPassword.value;

        if (!file || !password) {
            showStatus(encryptStatus, 'Please select a file and enter a password.', false);
            return;
        }

        const originalButtonText = encryptButton.innerHTML;
        encryptButton.disabled = true;
        showStatus(encryptStatus, 'Encrypting file...', true);

        try {
            // 1. Get file content
            const fileBuffer = await file.arrayBuffer();
            
            // 2. Generate salt and iv
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            // 3. Derive key (from utils.js)
            const key = await deriveKey(password, salt);
            
            // 4. Encrypt data
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                fileBuffer // Encrypt the original file buffer
            );
            
            // 5. Create metadata
            const meta = {
                name: file.name,
                type: file.type || 'application/octet-stream'
            };
            const metaBytes = new TextEncoder().encode(JSON.stringify(meta));
            
            // 6. Get metadata length (as 4 bytes)
            const metaLength = new Uint8Array(4);
            // Use a DataView to write the 32-bit integer
            // true = little-endian
            new DataView(metaLength.buffer).setUint32(0, metaBytes.length, true);

            // --- THIS IS THE FIX ---
            // 7. Create final buffer and combine all parts
            //    [salt(16)] + [iv(12)] + [metaLength(4)] + [metaBytes(?)] + [encryptedData(?)]
            const totalLength = 16 + 12 + 4 + metaBytes.length + encryptedData.byteLength;
            const combinedBuffer = new Uint8Array(totalLength);
            
            let offset = 0;
            combinedBuffer.set(salt, offset);
            offset += salt.length;
            
            combinedBuffer.set(iv, offset);
            offset += iv.length;
            
            combinedBuffer.set(metaLength, offset);
            offset += metaLength.length;
            
            combinedBuffer.set(metaBytes, offset);
            offset += metaBytes.length;
            
            combinedBuffer.set(new Uint8Array(encryptedData), offset);
            // --- END FIX ---
            
            // 8. Create Blob from the single, combined buffer
            const blob = new Blob([combinedBuffer], { type: 'application/octet-stream' });
            
            // 9. Download the file
            const encryptedFileName = file.name + '.enc';
            downloadFile(blob, encryptedFileName);

            showStatus(encryptStatus, 'Encryption successful! Downloading...', false);

        } catch (err) {
            console.error(err);
            showStatus(encryptStatus, `Error: ${err.message}`, false);
        } finally {
            encryptButton.disabled = false;
            encryptButton.innerHTML = originalButtonText;
            // Clear status after 5 seconds
            setTimeout(() => showStatus(encryptStatus, '', false), 5000);
        }
    });
});

