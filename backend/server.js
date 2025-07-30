import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import geminiRouter from "./routes/gemini.js";

const app = express();
const port = 3131;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use("/api/gemini", geminiRouter);

// 👉 Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// 👉 Handle SPA routes
app.get("/scan", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
