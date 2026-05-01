const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- BACKEND DATA ---
const businessData = {
  episodes: [
    { 
      id: 1, 
      title: "Coffee & The Word", 
      date: "May 2026", 
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Replace with real links later
    },
    { 
      id: 2, 
      title: "Faith in Jozi", 
      date: "April 2026", 
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
    }
  ],
  menu: [
    { name: "Traditional Bunna", price: "R25", desc: "Classic Ethiopian brew" },
    { name: "Bible & Coffee Latte", price: "R45", desc: "Our signature smooth blend" }
  ]
};

app.get('/api/data', (req, res) => {
  res.json(businessData);
});

// --- FRONTEND ---
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bunna Qurs | Podcast & Cafe</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 0; background: #121212; color: white; }
            .hero { padding: 60px 20px; text-align: center; background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'); background-size: cover; border-bottom: 3px solid #d4af37; }
            h1 { color: #d4af37; font-size: 2.8rem; margin: 0; }
            .btn { display: inline-block; padding: 12px 28px; background: #d4af37; color: black; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; transition: 0.3s; }
            .container { padding: 30px 20px; max-width: 600px; margin: auto; }
            h2 { color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 10px; }
            .card { background: #1e1e1e; padding: 20px; border-radius: 15px; margin-bottom: 20px; border-left: 4px solid #d4af37; }
            audio { width: 100%; margin-top: 15px; height: 35px; }
            .menu-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: #252525; border-radius: 8px; }
            .price { color: #d4af37; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="hero">
            <h1>ቡና ቁርስ</h1>
            <p style="font-size: 1.2rem; color: #ccc;">Where coffee meets the Word</p>
            <a href="https://linktr.ee/bunnaqurs" class="btn">Connect With Us</a>
        </div>

        <div class="container">
            <h2>🎧 Listen to Episodes</h2>
            <div id="podcast-list"></div>

            <h2 style="margin-top: 50px;">☕ Cafe Favorites</h2>
            <div id="menu-list"></div>
        </div>

        <script>
            fetch('/api/data')
                .then(res => res.json())
                .then(data => {
                    // Load Podcasts
                    document.getElementById('podcast-list').innerHTML = data.episodes.map(ep => \`
                        <div class="card">
                            <h3 style="margin:0">\${ep.title}</h3>
                            <small style="color:#888">\${ep.date}</small><br>
                            <audio controls src="\${ep.audioUrl}"></audio>
                        </div>
                    \`).join('');

                    // Load Menu
                    document.getElementById('menu-list').innerHTML = data.menu.map(item => \`
                        <div class="menu-item">
                            <div>
                                <strong>\${item.name}</strong><br>
                                <small style="color:#888">\${item.desc}</small>
                            </div>
                            <div class="price">\${item.price}</div>
                        </div>
                    \`).join('');
                });
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => console.log('Bunna Qurs is running!'));

