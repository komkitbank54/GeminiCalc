import express from "express";
import cors from "cors";
import geminiRouter from "./routes/gemini.js";

const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use("/api/gemini", geminiRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
