const appRoutes = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

appRoutes.post("/text", async (req, res) => {
  if (!req.body?.prompt)
    return res.status(400).send({ error: "Prompt is required" });

  const { prompt } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  res.send({ text });
});

appRoutes.post("/image", upload.array("files", 5), async (req, res) => {
  if (!req.body?.prompt)
    return res.status(400).send({ error: "Prompt is required" });

  const { prompt } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  console.log("req.files", req.files);
  const imageParts = req.files.map((file) => ({
    inlineData: {
      data: Buffer.from(fs.readFileSync(file.path)).toString("base64"),
      mimeType: file.mimetype,
    },
  }));

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  res.send({ text });
});

module.exports = appRoutes;
