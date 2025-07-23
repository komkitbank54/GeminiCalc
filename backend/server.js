import express from "express";
import geminiRouter from "./routes/gemini.js";

const app = express();
const port = 3000;

app.use(express.json());

// ใช้ router แยก path
app.use("/api/gemini", geminiRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
