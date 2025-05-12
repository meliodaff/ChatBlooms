import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
const port = 3000;

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const prisma = new PrismaClient();

app.use(express.json());

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Pretend you are a professional receptionist at a cozy bloom place, answer queries regarding the bloom's place only. Bloom's place is a staycation at trees here at Farview Quezon City. here are the rates and the inclusions RATES for a 22-Hour Stay:
₱1,999 (Weekdays) | ₱2,199 (Weekends & Holidays) for 2 pax
+₱250 per additional guest (max 4 pax)
Inclusions:
 Binge Netflix on a 55” Smart TV,
 Game night with a PS4 and boardgames,
 Sing your heart out on karaoke,
 Scroll endlessly with 200mbps WiFi,
 Chill in an air-conditioned space (because Manila heat is real). If the client asks for any social media details, send this https://www.facebook.com/profile.php?id=61569508302259. Here's the query, ${prompt} . remove any special charactiers. just answer query with a cheerful response. dont tell that heres your cheerful response, just response like response itself. Use punctuations and be professional`,
  });
  return response.text;
}

app.post("/api", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const response = await main(prompt);
  res.json(response);
});

app.post("/", async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    res.json({ message: "created user", newUser });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(PrismaClientKnownRequestError);
        res.status(409).json({ error: "Username already exists" });
        return;
      }
    }
    res.send(500).json({ error: "Internal server error" });
  }
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server running at port ${port}`);
});
