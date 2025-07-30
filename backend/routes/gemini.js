import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";
import multer from "multer";
import rateLimit from "express-rate-limit";

dotenv.config({ quiet: true });

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 60,
  message: "คุณใช้สิทธิ์ครบ 60 requests ต่อวันแล้ว! กรุณารอวันถัดไป.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", limiter, upload.single("image"), async (req, res) => {
  try {
    const img = req.file;
    if (!img) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const base64ImageFile = img.buffer.toString("base64");
    const contents = [
      {
        inlineData: {
          mimeType: img.mimetype,
          filename: img.originalname,
          data: base64ImageFile,
        },
      },
      {
        text: process.env.GEMINI_PROMPT,
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
