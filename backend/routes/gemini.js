import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// ใช้ API KEY จาก env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST endpoint
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
