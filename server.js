const express = require("express");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createReadStream, unlinkSync } = require("fs-extra");
const cors = require("cors");
const Youtube = require("youtube-search-api");

const app = express();
const PORT = process.env.PORT || 3050;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path<HTMLDivElement>.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

// Create cache folder for audio files
const downloadDir = path.join(__dirname, "cache");
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Serve the main views
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "index.html")));
app.get("/chatbot", (req, res) => res.sendFile(path.join(__dirname, "views", "chatbot.html")));
app.get("/downloader", (req, res) => res.sendFile(path.join(__dirname, "views", "downloader.html")));
app.get("/rmbg", (req, res) => res.sendFile(path.join(__dirname, "views", "removebg.html")));
app.get("/imagine", (req, res) => res.sendFile(path.join(__dirname, "views", "imagine.html")));
app.get("/audio-down", (req, res) => res.sendFile(path.join(__dirname, "views", "audio-down.html")));

// ChatBot API
app.get("/chatbot/api", async (req, res) => {
  try {
    const { message } = req.query;
    const response = await axios.get(`https://zerox-chat-bot-api.onrender.com/chat?message=${encodeURIComponent(message)}`);
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
    res.json({ imageUrl: "/removed-bg.png" });
  } catch (error) {
    res.status(500).json({ error: "RemoveBG API error" });
  }
});

// Imagine AI API
app.post("/imagine/api", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const apiUrl = `https://rubish-apihub.onrender.com/rubish//sdxl?prompt=${encodeURIComponent(prompt)}&apikey=rubish69`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const imageBase64 = Buffer.from(response.data, "binary").toString("base64");
    res.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error("Imagine API error:", error.message);
    res.status(500).json({ error: "Failed to generate image. Please try again!" });
  }
});

// Audio Downloader - YouTube
app.post("/audio-down/yt", async (req, res) => {
  const { url, search } = req.body;
  const safeTitle = (title) => title.replace(/[^a-zA-Z0-9 \-_]/g, "");
  const filePath = path.join(downloadDir, `audio_${Date.now()}.mp3`);

  if (!url && !search) {
    return res.status(400).json({ error: "URL or search term required" });
  }

  if (url && url.includes("youtube.com")) {
    try {
      const apiRes = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const api = apiRes.data.down_stream;
      const data = await axios.get(`${api}/nayan/yt?url=${url}`);
      const { title, audio_down } = data.data.data;

      const writer = fs.createWriteStream(filePath);
      const fileStream = await axios({ url: audio_down, method: "GET", responseType: "stream" });
      fileStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 26214400) {
        unlinkSync(filePath);
        return res.status(400).json({ error: "File size exceeds 25MB limit" });
      }

      res.json({ audioUrl: `/cache/${path.basename(filePath)}`, title });
      setTimeout(() => unlinkSync(filePath), 60000); // Cleanup after 1 minute
    } catch (error) {
      res.status(500).json({ error: "Failed to download YouTube audio" });
    }
  } else if (search) {
    try {
      const data = await Youtube.GetListByKeyword(search, false, 5);
      const results = data.items.map((item, index) => ({
        index: index + 1,
        title: item.title,
        id: item.id,
        duration: item.length.simpleText
      }));
      res.json({ searchResults: results });
    } catch (error) {
      res.status(500).json({ error: "Failed to search YouTube" });
    }
  }
});

// Audio Downloader - Spotify
app.post("/audio-down/spotify", async (req, res) => {
  const { url, search } = req.body;
  const safeTitle = (title) => title.replace(/[^a-zA-Z0-9 \-_]/g, "");
  const filePath = path.join(downloadDir, `audio_${Date.now()}.mp3`);

  if (!url && !search) {
    return res.status(400).json({ error: "URL or search term required" });
  }

  if (url && url.startsWith("https://open.spotify.com/")) {
    try {
      const response = await axios.get(`https://nayan-video-downloader.vercel.app/spotifyDl?url=${url}`);
      const { title, artistNames, duration, download_url } = response.data.data;

      const writer = fs.createWriteStream(filePath);
      const fileStream = await axios({ url: download_url, method: "GET", responseType: "stream" });
      fileStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 26214400) {
        unlinkSync(filePath);
        return res.status(400).json({ error: "File size exceeds 25MB limit" });
      }

      res.json({ audioUrl: `/cache/${path.basename(filePath)}`, title, artist: artistNames.join(", "), duration });
      setTimeout(() => unlinkSync(filePath), 60000);
    } catch (error) {
      res.status(500).json({ error: "Failed to download Spotify audio" });
    }
  } else if (search) {
    try {
      const response = await axios.get(`https://nayan-video-downloader.vercel.app/spotify-search?name=${encodeURIComponent(search)}&limit=5`);
      const results = response.data.results.map((song, index) => ({
        index: index + 1,
        title: song.name,
        artist: song.artists,
        url: song.link
      }));
      res.json({ searchResults: results });
    } catch (error) {
      res.status(500).json({ error: "Failed to search Spotify" });
    }
  }
});

// Audio Downloader - SoundCloud
app.post("/audio-down/scloud", async (req, res) => {
  const { url, search } = req.body;
  const safeTitle = (title) => title.replace(/[^a-zA-Z0-9 \-_]/g, "");
  const filePath = path.join(downloadDir, `audio_${Date.now()}.mp3`);

  if (!url && !search) {
    return res.status(400).json({ error: "URL or search term required" });
  }

  if (url && url.startsWith("https://soundcloud.com/")) {
    try {
      const response = await axios.get(`https://nayan-video-downloader.vercel.app/soundcloud?url=${encodeURIComponent(url)}`);
      const { title, artist, duration, download_url } = response.data.data;

      const writer = fs.createWriteStream(filePath);
      const fileStream = await axios({ url: download_url, method: "GET", responseType: "stream" });
      fileStream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 26214400) {
        unlinkSync(filePath);
        return res.status(400).json({ error: "File size exceeds 25MB limit" });
      }

      res.json({ audioUrl: `/cache/${path.basename(filePath)}`, title, artist, duration });
      setTimeout(() => unlinkSync(filePath), 60000);
    } catch (error) {
      res.status(500).json({ error: "Failed to download SoundCloud audio" });
    }
  } else if (search) {
    try {
      const response = await axios.get(`https://nayan-video-downloader.vercel.app/soundcloud-search?name=${encodeURIComponent(search)}&limit=5`);
      const results = response.data.results
        .filter(item => item.kind === "track")
        .map((song, index) => ({
          index: index + 1,
          title: song.title,
          artist: song.permalink_url.split("/")[3] || "Unknown",
          url: song.permalink_url
        }));
      res.json({ searchResults: results });
    } catch (error) {
      res.status(500).json({ error: "Failed to search SoundCloud" });
    }
  }
});

// Serve cached audio files
app.use("/cache", express.static(downloadDir));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
