const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DATABASE ---
let cafeMenu = [
  { id: 1, name: "Traditional Bunna", price: "R25" },
  { id: 2, name: "Bible & Coffee Latte", price: "R45" }
];
let messages = [];

// --- API ROUTES ---
app.get('/api/data', (req, res) => res.json({ menu: cafeMenu }));

app.post('/api/update-menu', (req, res) => {
  const item = cafeMenu.find(m => m.id === parseInt(req.body.id));
  if (item) { item.price = req.body.newPrice; res.json({ success: true }); }
  else { res.status(404).send("Not found"); }
});

app.post('/api/contact', (req, res) => {
  messages.unshift({ ...req.body, date: new Date().toLocaleString() });
  res.json({ success: true });
});

// --- ADMIN PAGE ---
app.get('/admin', (req, res) => {
  if (req.query.key !== "1234") return res.status(403).send("Denied");
  const menuHtml = cafeMenu.map(i => `
    <div style="background:#222;padding:15px;margin:10px 0;border-radius:12px;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #d4af37;">
      <span>${i.name}: <b style="color:#d4af37">${i.price}</b></span>
      <button onclick="edit('${i.id}')" style="background:#d4af37;border:none;padding:8px 15px;border-radius:5px;font-weight:bold;cursor:pointer;">Update</button>
    </div>`).join('');
  
  res.send(\`<html><body style="background:#121212;color:white;font-family:sans-serif;padding:20px;">
    <h1 style="color:#d4af37">Admin Dashboard</h1>
    <p>Update prices here to change the live site.</p>
    \${menuHtml}
    <script>async function edit(id){
      const p = prompt("New Price (e.g. R50):");
      if(p){ await fetch('/api/update-menu',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,newPrice:p})});location.reload();}}
    </script></body></html>\`);
});

// --- MAIN WEBSITE ---
app.get('/', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Bunna Qurs | Bible & Coffee</title>
        <style>
            body { background: #121212; color: white; font-family: 'Segoe UI', sans-serif; margin: 0; }
            .hero { 
                background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000');
                background-size: cover; background-position: center;
                padding: 80px 20px; text-align: center; border-bottom: 4px solid #d4af37;
            }
            .hero h1 { color: #d4af37; font-size: 3rem; margin: 0; text-shadow: 2px 2px 10px rgba(0,0,0,0.8); }
            .container { padding: 20px; max-width: 600px; margin: auto; }
            .section-title { text-align: center; color: #d4af37; margin: 40px 0 20px; text-transform: uppercase; letter-spacing: 2px; }
            .card { background: #1e1e1e; padding: 20px; border-radius: 15px; margin-bottom: 15px; border-left: 5px solid #d4af37; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
            .menu-row { display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; }
            .price { color: #d4af37; }
            .input-group { margin-top: 20px; }
            input, textarea { width: 100%; padding: 12px; margin: 8px 0; background: #252525; border: 1px solid #444; color: white; border-radius: 8px; box-sizing: border-box; }
            .btn { background: #d4af37; color: black; padding: 15px; width: 100%; border: none; border-radius: 50px; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 10px; transition: 0.3s; }
            .btn:active { transform: scale(0.98); }
        </style>
    </head>
    <body>
        <div class="hero"><h1>ቡና ቁርስ</h1><p>Where coffee meets the Word</p></div>
        <div class="container">
            <h2 class="section-title">☕ Cafe Favorites</h2>
            <div id="m-list"></div>

            <h2 class="section-title">🙏 Connection Point</h2>
            <div class="card">
                <input id="n" placeholder="Your Name">
                <textarea id="m" placeholder="Prayer Request or Message" rows="4"></textarea>
                <button class="btn" onclick="send()">Send Message</button>
                <p id="status" style="color:#d4af37; text-align:center; margin-top:10px;"></p>
            </div>
        </div>
        <script>
            fetch('/api/data').then(r=>r.json()).then(d=>{
                document.getElementById('m-list').innerHTML = d.menu.map(i=>\`
                    <div class="card">
                        <div class="menu-row"><span>\${i.name}</span><span class="price">\${i.price}</span></div>
                    </div>
                \`).join('');
            });
            async function send(){
                const res = await fetch('/api/contact',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({name:document.getElementById('n').value, message:document.getElementById('m').value})
                });
                if(res.ok) {
                    document.getElementById('status').innerText = "✨ Sent to the Fam!";
                    document.getElementById('n').value = ''; document.getElementById('m').value = '';
                }
            }
        </script>
    </body></html>\`);
});

app.listen(PORT, () => console.log("Ready"));
