const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files (frontend)

const API_BASE_URL = "https://nayan-video-downloader.vercel.app";

// Route for Video Download
app.get("/download/video", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const response = await axios.get(`${API_BASE_URL}/alldown?url=${encodeURIComponent(url)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video data" });
    }
});

// Route for YouTube Download
app.get("/download/youtube", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const response = await axios.get(`${API_BASE_URL}/ytdown?url=${encodeURIComponent(url)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch YouTube video" });
    }
});

// Route for Spotify/Music Download
app.get("/download/music", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const response = await axios.get(`${API_BASE_URL}/spotifyDl?url=${encodeURIComponent(url)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch music data" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
