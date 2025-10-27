import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("File", fileSchema);
