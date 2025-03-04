async function downloadVideo() {
    const url = document.getElementById("videoUrl").value;
    if (!url) return alert("Please enter a video URL");

    const response = await fetch(`/download/video?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById("videoResults").innerHTML = "<p>Error fetching video.</p>";
        return;
    }

    document.getElementById("videoResults").innerHTML = `
        <button class="download-btn" onclick="window.open('${data.data.high}', '_blank')">Download High Quality</button>
        <button class="download-btn" onclick="window.open('${data.data.low}', '_blank')">Download Low Quality</button>
    `;
}

async function downloadMusic() {
    const url = document.getElementById("musicUrl").value;
    if (!url) return alert("Please enter a music URL");

    const response = await fetch(`/download/music?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById("musicResults").innerHTML = "<p>Error fetching music.</p>";
        return;
    }

    document.getElementById("musicResults").innerHTML = `
        <button class="download-btn" onclick="window.open('${data.data.audio}', '_blank')">Download Music</button>
    `;
}
