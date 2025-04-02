const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/chatbot", (req, res) => res.render("chatbot"));
app.get("/downloader", (req, res) => res.render("downloader"));
app.get("/rmbg", (req, res) => res.render("removebg"));
app.get("/imagine", (req, res) => res.render("imagine"));

// API for Chatbot
app.post("/chatbot/api", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await axios.get(
      `https://zerox-chat-bot-api.onrender.com/chat?query=${encodeURIComponent(userMessage)}`
    );
    res.json({ reply: response.data.reply });
  } catch (error) {
    res.status(500).json({ error: "Chatbot API failed" });
  }
});

// API for Downloader
app.post("/downloader/api", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Downloader API failed" });
  }
});

// Multer for RemoveBG
const upload = multer({ dest: "uploads/" });

app.post("/rmbg/api", upload.single("image"), async (req, res) => {
  try {
    const API_KEYS = [
      "y5K9ssQnhr8sB9Tp4hrMsLtU",
      "s6d6EanXm7pEsck9zKjgnJ5u",
      "GJkFyR3WdGAwn8xW5MDYAVWf",
      "xHSGza4zdY8KsHGpQs4phRx9",
      "ymutgb6hEYEDR6xUbfQUiPri",
      "m6AhtWhWJBAPqZzy5BrvMmUp",
      "ZLTgza4FPGii1AEUmZpkzYb7"
    ];
    const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
    const imagePath = req.file.path;

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", fs.readFileSync(imagePath), {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/octet-stream"
      },
      responseType: "arraybuffer"
    });

    fs.writeFileSync("public/removed-bg.png", response.data);
    res.json({ imageUrl: "/removed-bg.png" });
  } catch (error) {
    res.status(500).json({ error: "RemoveBG API failed" });
  }
});

// API for Imagine
app.post("/imagine/api", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await axios.get(
      `https://rubish-apihub.onrender.com/rubish//sdxl?prompt=${encodeURIComponent(prompt)}&apikey=rubish69`
    );
    res.json({ imageUrl: response.data.image_url });
  } catch (error) {
    res.status(500).json({ error: "Imagine API failed" });
  }
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
