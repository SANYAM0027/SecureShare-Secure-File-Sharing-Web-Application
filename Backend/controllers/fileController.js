import fs from "fs";
import path from "path";
import File from "../models/File.js";

export const uploadFile = async (req, res) => {
  try {
    const { originalname, filename } = req.file;
    const file = await File.create({ originalName: originalname, storedName: filename });
    res.json({ id: file._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    const filePath = path.join("uploads", file.storedName);
    res.download(filePath, file.originalName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
