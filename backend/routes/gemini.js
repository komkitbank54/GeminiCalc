import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const router = express.Router();

// ใช้ API KEY จาก env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST endpoint
router.post("/", async (req, res) => {
  try {
    const base64ImageFile = fs.readFileSync("./img/48119.jpg", {
        encoding: "base64",
    });
    const contents = [
        {
            inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageFile,
            },
        },
        { text: `Objective:
            ดูภาพโพยหวยใต้ดินไทย แล้วคำนวณรวมยอดตามกติกาด้านล่าง พร้อมตอบกลับตามฟอร์แมตที่กำหนด

            กติกา:

            ทั่วไป: เช่น 173 - 10 คือเลข 173 ซื้อ 10

            รวม: เช่น 130 - 50x50 คือ 50+50 = 100

            กลุ่ม: ถ้ามี { ชี้เลขหลายตัวกับราคาเดียว เช่น 83, 38 } - 50 คือ 50+50 = 100

            รูปแบบผลลัพธ์:
            1. ถ้าชัดทุกตัวเลข → status: PASS, process: <เลข>:<ราคา> + ... , sum: <รวมทั้งหมด>, result: <หมายเหตุ>
            2. ถ้ามีเลขอ่านได้หลายแบบ → status: AMBIGUOUS, note: "...", scenario_1: {...}, scenario_2: {...}
            3. ถ้าเบลอหรือข้อมูลขาด → status: FAIL, result: <หมายเหตุ>

            หมายเหตุ: return มาเป็น pattern สำหรับนำไปใช้ต่อ และเฉพาะส่วน result ถ้ามีหลายเหตุให้ตอบภาษาไทย แต่พวกสถานะและตัวเลขให้เป็นภาษาอังกฤษ`
        },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;