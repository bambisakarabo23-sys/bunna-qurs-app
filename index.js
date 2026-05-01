const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DYNAMIC DATABASE ---
let messages = []; 
let cafeMenu = [
  { id: 1, name: "Traditional Bunna", price: "R25", desc: "Classic Ethiopian brew" },
  { id: 2, name: "Bible & Coffee Latte", price: "R45", desc: "Our signature smooth blend" }
];

const episodes = [
  { id: 1, title: "Coffee & The Word", date: "May 2026", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Faith in Jozi", date: "April 2026", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
];

// --- API ROUTES ---
app.get('/api/data', (req, res) => {
  res.json({ episodes, menu: cafeMenu });
});

// Update Menu Item
app.post('/api/update-menu', (req, res) => {
  const { id, newPrice } = req.body;
  const item = cafeMenu.find(m => m.id === parseInt(id));
  if (item) {
    item.price = newPrice;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.post('/api/contact', (req, res) => {
  messages.unshift({ ...req.body, id: Date.now(), timestamp: new Date().toLocaleString() });
  res.json({ success: true });
});

// --- ADMIN PAGE ---
app.get('/admin', (req, res) => {
  if (req.query.key !== "1234") return res.status(403).send("Unauthorized");

  const menuEditor = cafeMenu.map(i => `
    <div style="background:#252525; padding:10px; margin-bottom:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <span>${i.name} (${i.price})</span>
        <button onclick="updatePrice(${i.id})" style="background:#d4af37; border:none; padding:5px 10px; border-radius:5px; font-weight:bold;">Change Price</button>
    </div>
  `).join('');

  const messageList = messages.map(m => `
    <div style="background:#1e1e1e; padding:15px; margin-bottom:10px; border-radius:10px; border-left:4px solid #d4af37">
        <strong style="color:#d4af37">[${m.type}]</strong> from ${m.name}<br><p>${m.message}</p>
    </div>
  `).join('');

  res.send(`
    <html>
    <body style="background:#121212; color:white; font-family:sans-serif; padding:20px;">
        <h1>Admin Dashboard</h1>
        
        <h2>☕ Edit Cafe Prices</h2>
        ${menuEditor}

        <h2>🙏 Inbox</h2>
        ${messages.length > 0 ? messageList : "<p>No new messages.</p>"}

        <script>
            async function updatePrice(id) {
                const newPrice = prompt("Enter new price (e.g., R50):");
                if (newPrice) {
                    await fetch('/api/update-menu', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id, newPrice })
                    });
                    location.reload();
                }
            }
        </script>
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
        <title>Bunna Qurs</title>
        <style>
            body { font-family: sans-serif; margin: 0; background: #121212; color: white; }
            .hero { padding: 60px 20px; text-align: center; background: #1a1a1a; border-bottom: 3px solid #d4af37; }
            h1 { color: #d4af37; margin: 0; }
            .container { padding: 20px; max-width: 500px; margin: auto; }
            .card { background: #1e1e1e; padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #d4af37; }
            .menu-item { display:flex; justify-content:space-between; margin-bottom:10px; padding:10px; background:#252525; border-radius:8px; }
        </style>
    </head>
    <body>
        <div class="hero"><h1>ቡና ቁርስ</h1><p>Bible & Coffee</p></div>
        <div class="container">
            <h2>🎧 Latest Podcast</h2><div id="ep-list"></div>
            <h2>☕ Cafe Menu</h2><div id="m-list"></div>
        </div>
        <script>
            fetch('/api/data').then(r => r.json()).then(d => {
                document.getElementById('ep-list').innerHTML = d.episodes.map(e => \`<div class="card"><h3>\${e.title}</h3><audio controls src="\${e.audioUrl}" style="width:100%"></audio></div>\`).join('');
                document.getElementById('m-list').innerHTML = d.menu.map(i => \`<div class="menu-item"><span>\${i.name}</span><span style="color:#d4af37; font-weight:bold">\${i.price}</span></div>\`).join('');
            });
        </script>
    </body>
    </html>
  \`);
});

app.listen(PORT, () => console.log('Live!'));

        
