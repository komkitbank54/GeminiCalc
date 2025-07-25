import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config({ quiet: true });

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ใช้ API KEY จาก env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST endpoint
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const img = req.file;
    if (!img) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const base64ImageFile = fs.readFileSync(img.path, {
        encoding: "base64",
    });
    const contents = [
        {
            inlineData: {
            mimeType: img.mimetype,
            filename: img.originalname,
            data: base64ImageFile,
            },
        },
        { text: `Look at the image of the Thai underground lottery slip and calculate the total amount according to the rules below, then reply in the specified format.
            Rules:
            General: For example, 173 - 10 means number 173 is bought for 10.
            Split: For example, 130 - 50x50 means 50 + 50 = 100.
            Group: If there’s } pointing to multiple numbers with the same amount, e.g., {83, 38} - 50 means 50 + 50 = 100.
            Turn: If there's a 'ก' or 'กลับ' before the number, it means the number is turned, e.g., 173 - 20*3ก means 173 - 20+20+20 and 371 - 20+20+20 = 120.
            Result format:
            If all numbers are clear → {"status": "PASS", "process": "<number>:<amount> + ..." , "sum": "<total>"}
            If a number can be read in multiple ways → {"status": "FAIL", "result": "Unreadable or missing data"}
            If blurred or data is missing → {"status": "FAIL", "result": "Unreadable or missing data"}
            Note: Return the result in this pattern for further processing. Use English for status and numbers, but if there are multiple remarks in result, write that part in Thai.
            Node2: When Returning don't return '''json, return only the result in the format specified above. Example: {"status": "PASS", "process": "173:10 + 130:50x50", "sum": "160"}.`
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