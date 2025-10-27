SecureShare — End-to-End Encrypted File Sharing Platform 🔒

Welcome to SecureShare, a secure web-based file-sharing platform designed to protect your data with true end-to-end encryption (E2EE). Files are encrypted on the client side before upload, ensuring that even the server cannot access unencrypted data. Only the recipient with the correct decryption key can unlock the file — guaranteeing complete privacy and security.

---

Project Overview
SecureShare empowers users to share files safely over the internet using advanced encryption and modern web security protocols. The project demonstrates how real-world encryption and cybersecurity practices can be implemented in a simple, user-friendly web application.

In addition to secure file sharing, SecureShare includes two awareness-driven features:
- Cyber News: Keeps users informed about the latest cybersecurity trends and threats.
- Report Cybercrime: Provides direct access to official portals for reporting cybercrimes.

---

Key Features
- 🔐 AES-256 Encryption: Industry-standard encryption for strong data protection.
- 💻 Client-Side Encryption: Files are encrypted before leaving your device.
- 🧩 Secure Key Management: No encryption keys stored on the server.
- 📱 Responsive Interface: Modern and easy-to-use web design.
- 📰 Cyber News: Stay updated on cybersecurity developments.
- 🛡️ Report Cybercrime: Promotes a safer digital environment.

---

Tools & Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Security Tools:
  - WebCrypto API (Encryption/Decryption)
  - Node.js Crypto Module (Hashing, Tokens)
  - Helmet.js + Csurf (OWASP Protections)
  - bcrypt/argon2 (Password Hashing)
  - Let’s Encrypt (HTTPS Certificate)
  - OWASP ZAP (Vulnerability Testing)

---

Project Structure
- index.html: Main landing page
- encrypt.html / decrypt.html: File encryption and decryption pages
- js/encrypt.js / decrypt.js: Client-side encryption logic
- server.js: Node.js backend server
- style.css: Frontend styling
- screenshots/ folder: Contains project screenshots

---

How It Works
1. Upload a file — The file is encrypted locally using AES-256 before upload.
2. Shareable link generated — The system provides a secure URL and a decryption key.
3. Recipient downloads — The receiver uses the key to decrypt and access the file safely.

---

Learnings
- Implemented real-world end-to-end encryption in a web app.
- Enhanced understanding of secure web development and OWASP standards.
- Learned about cryptography principles and data privacy mechanisms.
- Integrated awareness features for cybersecurity education.

---

Future Enhancements
- 🌐 Add real-time file sharing with WebRTC.
- ☁️ Integrate with cloud storage (Google Drive, Dropbox).
- 📧 Enable email-based secure file sharing
- 📱 Develop a mobile app version.

  
SecureShare — Privacy. Protection. Awareness.
