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

// --- ROUTES ---
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
    <div style="background:#222;padding:10px;margin:5px;border-radius:8px;display:flex;justify-content:space-between">
      <span>${i.name}: <b>${i.price}</b></span>
      <button onclick="edit('${i.id}')">Edit</button>
    </div>`).join('');
  
  res.send(`<html><body style="background:#121212;color:white;font-family:sans-serif;padding:20px;">
    <h1>Admin</h1>${menuHtml}
    <script>async function edit(id){
      const p = prompt("New Price:");
      if(p){ await fetch('/api/update-menu',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,newPrice:p})});location.reload();}}
    </script></body></html>`);
});

// --- WEBSITE ---
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
    body{background:#121212;color:white;font-family:sans-serif;text-align:center;}
    .card{background:#1e1e1e;margin:10px;padding:15px;border-radius:12px;border-left:4px solid #d4af37;}
    .btn{background:#d4af37;padding:10px;border-radius:5px;width:100%;font-weight:bold;margin-top:10px;border:none;}
  </style></head><body>
    <h1 style="color:#d4af37">ቡና ቁርስ</h1>
    <div id="m-list"></div>
    <div class="card"><h3>Contact Us</h3>
      <input id="n" placeholder="Name" style="width:90%;padding:8px;margin:5px;">
      <textarea id="m" placeholder="Message" style="width:90%;padding:8px;margin:5px;"></textarea>
      <button class="btn" onclick="send()">Send</button></div>
    <script>
      fetch('/api/data').then(r=>r.json()).then(d=>{
        document.getElementById('m-list').innerHTML = d.menu.map(i=>'<div class="card">'+i.name+': <b style="color:#d4af37">'+i.price+'</b></div>').join('');
      });
      async function send(){
        await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('n').value,message:document.getElementById('m').value})});
        alert("Sent!");}
    </script></body></html>`);
});

app.listen(PORT, () => console.log("Ready"));

