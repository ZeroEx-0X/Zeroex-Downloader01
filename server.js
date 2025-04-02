const express = require("express");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3050;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

// Serve the main views
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));
app.get("/chatbot", (req, res) => res.sendFile(path.join(__dirname, "views", "chatbot.html")));
app.get("/downloader", (req, res) => res.sendFile(path.join(__dirname, "views", "downloader.html")));
app.get("/rmbg", (req, res) => res.sendFile(path.join(__dirname, "views", "removebg.html")));
app.get("/imagine", (req, res) => res.sendFile(path.join(__dirname, "views", "imagine.html")));

// ChatBot API
app.post("/chatbot/api", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post("https://zerox-chat-bot-api.onrender.com/chat", { message });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Chatbot API error" });
  }
});

// Video Downloader API
app.post("/downloader/api", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${url}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Downloader API error" });
  }
});

// Remove Background API
app.post("/rmbg/api", upload.single("image"), async (req, res) => {
  try {
    const API_KEYS = ["y5K9ssQnhr8sB9Tp4hrMsLtU", "s6d6EanXm7pEsck9zKjgnJ5u"];
    const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
    const response = await axios.post("https://api.remove.bg/v1.0/removebg", {
      headers: { "X-Api-Key": apiKey }
    });
    // This assumes the image will be stored as "/removed-bg.png"
    res.json({ imageUrl: "/removed-bg.png" });
  } catch (error) {
    res.status(500).json({ error: "RemoveBG API error" });
  }
});

// Imagine AI API
app.post("/imagine/api", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiUrl = `https://rubish-apihub.onrender.com/rubish//sdxl?prompt=${encodeURIComponent(prompt)}&apikey=rubish69`;

    const response = await axios.get(apiUrl);
    // Assuming the API returns a base64 image or an image URL
    if (response.data && response.data.image) {
      res.json({ imageUrl: response.data.image });
    } else {
      res.status(500).json({ error: "Failed to generate image. Try again!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Imagine API error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
