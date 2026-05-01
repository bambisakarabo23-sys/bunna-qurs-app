const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DATABASE (In-Memory for now) ---
const businessData = {
  episodes: [
    { id: 1, title: "Coffee & The Word", date: "May 2026", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Faith in Jozi", date: "April 2026", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
  ],
  menu: [
    { name: "Traditional Bunna", price: "R25", desc: "Classic Ethiopian brew" },
    { name: "Bible & Coffee Latte", price: "R45", desc: "Our signature smooth blend" }
  ]
};

// This is where we will store messages until the server restarts
let messages = []; 

// --- ROUTES ---

app.get('/api/data', (req, res) => res.json(businessData));

app.post('/api/contact', (req, res) => {
  const newMessage = {
    id: Date.now(),
    ...req.body,
    timestamp: new Date().toLocaleString()
  };
  messages.unshift(newMessage); // Add new messages to the top
  console.log("New Message Received!");
  res.json({ success: true });
});

// --- ADMIN PAGE (SECRET) ---
app.get('/admin', (req, res) => {
  // Simple security: Only you know to add ?key=1234 to the URL
  const secretKey = req.query.key;
  if (secretKey !== "1234") {
    return res.status(403).send("<h1>Unauthorized</h1><p>You don't have permission to see this fam.</p>");
  }

  const messageRows = messages.map(m => `
    <div style="background:#1e1e1e; padding:15px; margin-bottom:10px; border-radius:10px; border-left:4px solid #d4af37">
        <strong style="color:#d4af37">[${m.type}]</strong> from <strong>${m.name}</strong> <br>
        <small style="color:#888">${m.timestamp}</small>
        <p style="margin-top:10px">${m.message}</p>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin | Bunna Qurs</title>
        <style>
            body { font-family: sans-serif; background: #121212; color: white; padding: 20px; }
            h1 { color: #d4af37; border-bottom: 2px solid #333; padding-bottom: 10px; }
        </style>
    </head>
    <body>
        <h1>Bunna Qurs Inbox</h1>
        <p>Total Messages: ${messages.length}</p>
        <div>${messages.length > 0 ? messageRows : "<p>No messages yet.</p>"}</div>
        <br>
        <a href="/" style="color:#d4af37; text-decoration:none">← Back to Site</a>
    </body>
    </html>
  `);
});

// --- MAIN FRONTEND ---
app.get('/', (req, res) => {
  res.send(\`
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
            .btn { display: inline-block; padding: 12px 28px; background: #d4af37; color: black; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; border:none; cursor:pointer; }
            .container { padding: 30px 20px; max-width: 600px; margin: auto; }
            h2 { color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 40px; }
            .card { background: #1e1e1e; padding: 20px; border-radius: 15px; margin-bottom: 20px; border-left: 4px solid #d4af37; }
            audio { width: 100%; margin-top: 15px; height: 35px; }
            .menu-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: #252525; border-radius: 8px; }
            .price { color: #d4af37; font-weight: bold; }
            input, textarea, select { width: 100%; padding: 12px; margin: 10px 0; background: #252525; border: 1px solid #333; color: white; border-radius: 8px; box-sizing: border-box; }
        </style>
    </head>
    <body>
        <div class="hero">
            <h1>ቡና ቁርስ</h1>
            <p style="font-size: 1.2rem; color: #ccc;">Where coffee meets the Word</p>
            <button onclick="document.getElementById('contact-sec').scrollIntoView({behavior: 'smooth'})" class="btn">Send a Prayer Request</button>
        </div>
        <div class="container">
            <h2>🎧 Latest Episodes</h2>
            <div id="podcast-list"></div>
            <h2>☕ Cafe Favorites</h2>
            <div id="menu-list"></div>
            <h2 id="contact-sec">🙏 Connection Point</h2>
            <div class="card">
                <form id="contact-form">
                    <input type="text" id="name" placeholder="Your Name" required>
                    <select id="type">
                        <option value="Message">General Message</option>
                        <option value="Prayer Request">Prayer Request</option>
                    </select>
                    <textarea id="message" rows="4" placeholder="How can we help?" required></textarea>
                    <button type="submit" class="btn" style="width:100%">Send to the Fam</button>
                </form>
                <p id="status" style="text-align:center; color:#d4af37"></p>
            </div>
        </div>
        <script>
            fetch('/api/data').then(res => res.json()).then(data => {
                document.getElementById('podcast-list').innerHTML = data.episodes.map(ep => \`
                    <div class="card"><h3>\${ep.title}</h3><small>\${ep.date}</small><audio controls src="\${ep.audioUrl}"></audio></div>
                \`).join('');
                document.getElementById('menu-list').innerHTML = data.menu.map(item => \`
                    <div class="menu-item"><div><strong>\${item.name}</strong><br><small>\${item.desc}</small></div><div class="price">\${item.price}</div></div>
                \`).join('');
            });

            document.getElementById('contact-form').onsubmit = async (e) => {
                e.preventDefault();
                const payload = {
                    name: document.getElementById('name').value,
                    type: document.getElementById('type').value,
                    message: document.getElementById('message').value
                };
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if(res.ok) {
                    document.getElementById('status').innerText = "✨ Sent! We'll be in touch.";
                    document.getElementById('contact-form').reset();
                }
            };
        </script>
    </body>
    </html>
  \`);
});

app.listen(PORT, () => console.log('Bunna Qurs is running!'));

