// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const fileId = Date.now().toString(36); // simple unique ID
  const newPath = path.join('uploads', fileId + '-' + req.file.originalname);
  fs.renameSync(req.file.path, newPath);

  res.json({ success: true, fileId });
});

app.get('/download/:id', (req, res) => {
  const files = fs.readdirSync('uploads');
  const file = files.find(f => f.startsWith(req.params.id));
  if (!file) return res.status(404).send("File not found");

  res.download(path.join('uploads', file));
});

app.listen(3000, () => console.log("Server running on http://127.0.0.1:3000"));
