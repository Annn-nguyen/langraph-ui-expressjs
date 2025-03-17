import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { HumanMessage } from "@langchain/core/messages";
import { processChat } from "./chatLogic";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Route to handle chat messages
app.post("/chat", async (req: Request, res: Response): Promise<any> => {
  try {
      const { message, sessionId } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });

      const response = await processChat([new HumanMessage(message)], sessionId);
      res.json({ reply: response.messages[response.messages.length - 1].content });
  } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

