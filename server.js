import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    name: "NOVA AI",
    status: "online"
  });
});

app.post("/api/chat", async (req, res) => {

  try {

    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

    if (!message) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    if (message.length > 10000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    const response =
      await client.responses.create({

        model: "gpt-5",

        instructions: `
You are NOVA AI, a personal AI website and project manager.

Your job is to follow the user's instructions carefully.

You can help with:
- website development
- HTML
- CSS
- JavaScript
- debugging
- project planning
- UI/UX ideas
- API integration
- GitHub workflows
- technical explanations

Important:
- Never claim that you changed a website when you did not.
- Never claim that you deployed something when you did not.
- Before destructive or irreversible actions, ask for confirmation.
- Give practical, concise answers.
- When writing code, make it complete and usable.
- If information is missing, clearly say what is needed.
        `,

        input: message
      });

    res.json({
      reply:
        response.output_text || "NOVA could not generate a response."
    });

  } catch (error) {

    console.error("NOVA error:", error);

    res.status(500).json({
      error: "NOVA server error."
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `NOVA server running on port ${PORT}`
  );
});
