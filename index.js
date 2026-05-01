const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- BACKEND: MOCK DATA ---
const episodes = [
  { id: 1, title: "Coffee & The Word", date: "May 2026", url: "#" },
  { id: 2, title: "Faith in Jozi", date: "April 2026", url: "#" }
];

// API Route for the frontend to get data
app.get('/api/data', (req, res) => {
  res.json({
    businessName: "Bunna Qurs",
    slogan: "Where coffee meets the Word",
    episodes: episodes
  });
});

// --- FRONTEND: THE WEBSITE ---
// Since we are on mobile, we'll send the HTML directly from the server
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bunna Qurs | Podcast & Cafe</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 0; background: #121212; color: white; text-align: center; }
            .hero { padding: 50px 20px; background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'); background-size: cover; }
            h1 { color: #d4af37; font-size: 2.5rem; }
            .btn { display: inline-block; padding: 12px 24px; background: #d4af37; color: black; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px; }
            .section { padding: 40px 20px; }
            .card { background: #1e1e1e; padding: 20px; border-radius: 10px; margin: 10px auto; max-width: 400px; border-left: 5px solid #d4af37; }
        </style>
    </head>
    <body>
        <div class="hero">
            <h1>ቡና ቁርስ (Bunna Qurs)</h1>
            <p>Join us every Friday for "Bible & Coffee"</p>
            <a href="https://linktr.ee/bunnaqurs" class="btn">Linktree</a>
        </div>
        <div class="section">
            <h2>Latest Episodes</h2>
            <div id="podcast-list">Loading...</div>
        </div>
        <script>
            // This script talks to your backend API
            fetch('/api/data')
                .then(res => res.json())
                .then(data => {
                    const list = document.getElementById('podcast-list');
                    list.innerHTML = data.episodes.map(ep => \`
                        <div class="card">
                            <h3>\${ep.title}</h3>
                            <p>\${ep.date}</p>
                        </div>
                    \`).join('');
                });
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => console.log('Server is running!'));
