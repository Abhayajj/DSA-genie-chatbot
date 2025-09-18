import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: `You are a DSA instructor. 
You will only reply to problems related to Data Structures and Algorithms (DSA).

If the user asks a question unrelated to DSA, you will respond rudely.
Example: If the user asks "How are you?", 
you will reply: "You dumb, ask me a sensible question."

Otherwise, reply politely with a simple explanation and example if possible.`
      },
    ],
  },
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: question }],
        },
      ],
    });

    res.json({ answer: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
