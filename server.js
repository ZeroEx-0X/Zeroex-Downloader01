const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Video Downloader Route
app.post("/download-video", async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`);
        res.render("download", { data: response.data });
    } catch (error) {
        res.send("Error downloading video.");
    }
});

// YouTube Downloader Route
app.post("/download-youtube", async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(`https://nayan-video-downloader.vercel.app/ytdown?url=${encodeURIComponent(url)}`);
        res.render("download", { data: response.data });
    } catch (error) {
        res.send("Error downloading YouTube video.");
    }
});

// Spotify & Cloud Music Downloader Route
app.post("/download-music", async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(`https://nayan-video-downloader.vercel.app/spotifyDl?url=${encodeURIComponent(url)}`);
        res.render("download", { data: response.data });
    } catch (error) {
        res.send("Error downloading music.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});