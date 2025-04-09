import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { HumanMessage } from "@langchain/core/messages";
import { processChat } from "./chatLogic";
import multer from "multer";
import xlsx from "xlsx";
import path from "path";
import { Request as ExpressRequest } from "express";
import { processQNote } from "./qnote";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
}

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

app.post("/qnote", upload.single("file"), async (req: MulterRequest, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Read the uploaded Excel file
    const filePath = path.resolve(req.file.path);
    const workbook = xlsx.readFile(filePath);

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];

    // Parse the sheet into JSON
    const data = xlsx.utils.sheet_to_json(firstSheet);

    const clinicalNotes = data.map((item: any) => ({
      id: item["No."],
      content: item["Clinical Note"],
    }));

    const results = [];
    for await (const note of clinicalNotes) {
      const result = await processQNote(note.content);
      results.push({ id: note.id, clinicalNote: note.content, assessment: result.assessment });
    }

    fs.unlinkSync(filePath);

    res.json({ message: "File processed successfully", results });
  } catch (error) {
    console.error("QNote Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

