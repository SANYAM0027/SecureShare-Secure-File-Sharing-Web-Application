import express from "express";
import multer from "multer";
import { uploadFile, getFile } from "../controllers/fileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), uploadFile);
router.get("/:id", getFile);

export default router;
