const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DATA ---
let messages = []; 
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

// --- ROUTES ---
app.get('/api/data', (req, res) => res.json(businessData));

app.post('/api/contact', (req, res) => {
  const newMessage = {
    id: Date.now(),
    ...req.body,
    timestamp: new Date().toLocaleString()
  };
  messages.unshift(newMessage);
  res.json({ success: true });
});

app.get('/admin', (req, res) => {
  if (req.query.key !== "1234") {
    return res.status(403).send("<h1>Unauthorized</h1>");
  }
  const rows = messages.map(m => `
    <div style="background:#1e1e1e; padding:15px; margin-bottom:10px; border-radius:10px; border-left:4px solid #d4af37">
        <strong style="color:#d4af37">[${m.type}]</strong> from ${m.name}<br>
        <p>${m.message}</p>
        <small style="color:#888">${m.timestamp}</small>
    </div>
  `).join('');
  res.send(`<html><body style="background:#121212;color:white;font-family:sans-serif;padding:20px;">
    <h1>Inbox</h1>${messages.length > 0 ? rows : "<p>No messages.</p>"}
    <br><a href="/" style="color:#d4af37">← Back</a></body></html>`);
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bunna Qurs</title>
        <style>
            body { font-family: sans-serif; margin: 0; background: #121212; color: white; }
            .hero { padding: 60px 20px; text-align: center; background: #1a1a1a; border-bottom: 3px solid #d4af37; }
            h1 { color: #d4af37; margin: 0; }
            .btn { display: inline-block; padding: 12px 28px; background: #d4af37; color: black; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; border:none; width: 100%; cursor:pointer; }
            .container { padding: 20px; max-width: 500px; margin: auto; }
            .card { background: #1e1e1e; padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #d4af37; }
            input, textarea, select { width: 100%; padding: 10px; margin: 8px 0; background: #252525; border: 1px solid #333; color: white; border-radius: 8px; box-sizing: border-box; }
        </style>
    </head>
    <body>
        <div class="hero"><h1>ቡና ቁርስ</h1><p>Bible & Coffee Fam</p></div>
        <div class="container">
            <h2>🎧 Episodes</h2><div id="ep-list"></div>
            <h2>☕ Menu</h2><div id="m-list"></div>
            <h2>🙏 Contact</h2>
            <div class="card">
                <form id="c-form">
                    <input type="text" id="n" placeholder="Name" required>
                    <select id="t"><option>Message</option><option>Prayer Request</option></select>
                    <textarea id="m" placeholder="Message" required></textarea>
                    <button type="submit" class="btn">Send</button>
                </form>
                <p id="s" style="color:#d4af37; text-align:center"></p>
            </div>
        </div>
        <script>
            fetch('/api/data').then(r => r.json()).then(d => {
                document.getElementById('ep-list').innerHTML = d.episodes.map(e => \`<div class="card"><h3>\${e.title}</h3><audio controls src="\${e.audioUrl}" style="width:100%"></audio></div>\`).join('');
                document.getElementById('m-list').innerHTML = d.menu.map(i => \`<div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>\${i.name}</span><span style="color:#d4af37">\${i.price}</span></div>\`).join('');
            });
            document.getElementById('c-form').onsubmit = async (e) => {
                e.preventDefault();
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: document.getElementById('n').value, type: document.getElementById('t').value, message: document.getElementById('m').value })
                });
                if(res.ok) { document.getElementById('s').innerText = "Sent!"; document.getElementById('c-form').reset(); }
            };
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => console.log('Running!'));
