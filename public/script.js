async function downloadVideo() {
    const url = document.getElementById("videoUrl").value;
    if (!url) return alert("Please enter a video URL");

    const response = await fetch(`/download/video?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById("videoResults").innerHTML = "Error fetching video.";
        return;
    }

    document.getElementById("videoResults").innerHTML = `
        <p><strong>${data.data.title}</strong></p>
        <img src="${data.data.thumbnail || 'https://via.placeholder.com/150'}" alt="Thumbnail">
        <p><a href="${data.data.high}" target="_blank">Download High Quality</a></p>
        <p><a href="${data.data.low}" target="_blank">Download Low Quality</a></p>
    `;
}

async function downloadMusic() {
    const url = document.getElementById("musicUrl").value;
    if (!url) return alert("Please enter a music URL");

    const response = await fetch(`/download/music?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
        document.getElementById("musicResults").innerHTML = "Error fetching music.";
        return;
    }

    document.getElementById("musicResults").innerHTML = `
        <p><strong>${data.data.title}</strong></p>
        <p><a href="${data.data.audio}" target="_blank">Download Music</a></p>
    `;
}
