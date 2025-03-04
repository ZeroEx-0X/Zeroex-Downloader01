const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

const VIDEO_API = "#";
const SPOTIFY_API = "#";

// Video Downloader Route
app.get("/download/video", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ error: "URL is required" });

    try {
        const response = await fetch(VIDEO_API + encodeURIComponent(url));
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({ error: "Failed to fetch video data" });
    }
});

// Spotify Downloader Route
app.get("/download/music", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ error: "URL is required" });

    try {
        const response = await fetch(SPOTIFY_API + encodeURIComponent(url));
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({ error: "Failed to fetch music data" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
