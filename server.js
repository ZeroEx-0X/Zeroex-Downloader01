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

// Generic function to fetch download links
const fetchDownloadLink = async (apiUrl, url) => {
    try {
        const response = await axios.get(`${apiUrl}${encodeURIComponent(url)}`);
        console.log("API Response:", response.data);
        
        if (response.data && response.data.download_link) {
            return response.data.download_link;
        } else {
            return null;
        }
    } catch (error) {
        console.error("API Error:", error.message);
        return null;
    }
};

// Video Downloader Route
app.post("/download-video", async (req, res) => {
    const downloadLink = await fetchDownloadLink(
        "https://nayan-video-downloader.vercel.app/alldown?url=", 
        req.body.url
    );

    res.render("download", { downloadLink });
});

// YouTube Downloader Route
app.post("/download-youtube", async (req, res) => {
    const downloadLink = await fetchDownloadLink(
        "https://nayan-video-downloader.vercel.app/ytdown?url=", 
        req.body.url
    );

    res.render("download", { downloadLink });
});

// Spotify & Cloud Music Downloader Route
app.post("/download-music", async (req, res) => {
    const downloadLink = await fetchDownloadLink(
        "https://nayan-video-downloader.vercel.app/spotifyDl?url=", 
        req.body.url
    );

    res.render("download", { downloadLink });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
