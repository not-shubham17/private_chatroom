# 🔒 Private Chatroom — Project Guide

Your project is simple — it only has **3 files that matter**. Here's everything you need to know.

---

## 📁 Project Structure (Simplified)

```
d:\Projects\Private Chatroom\
├── server.js              ← The backend server (handles connections & relays messages)
├── package.json           ← Project config (name, dependencies, run scripts)
├── public/
│   └── index.html         ← THE ENTIRE FRONTEND (HTML + CSS + JavaScript, all-in-one)
└── node_modules/          ← ❌ Don't touch this (auto-generated dependencies)
```

> [!IMPORTANT]
> Your entire app is basically **2 files**: `server.js` (backend) and `public/index.html` (frontend). That's it!

---

## 1️⃣ How to Edit What You Want

The `index.html` file is 1,841 lines long because it contains **everything** in one file. Here's a map:

### 🎨 Frontend — [index.html](file:///d:/Projects/Private%20Chatroom/public/index.html)

| What you want to change | Where to look | Lines (approx) |
|---|---|---|
| **Colors, fonts, spacing** | CSS variables at the top (`:root { ... }`) | Lines 18–44 |
| **Background effects** (grid, glowing orbs) | CSS after `:root` | Lines 60–114 |
| **Button styles** | `.btn`, `.btn-primary`, etc. | Lines 138–200 |
| **Landing page layout** | `.landing-container`, `.brand`, etc. | Lines 211–407 |
| **Chat page layout** | `.chat-header`, `.chat-messages`, `.msg` | Lines 412–660 |
| **Toast notifications** | `.toast` styles | Lines 712–757 |
| **Modal popup** | `.modal-backdrop`, `.modal-content` | Lines 762–800 |
| **Landing page HTML** (buttons, text, forms) | `<div id="landing-view">` | ~Lines 810–950 |
| **Chat page HTML** (header, message area, input) | `<div id="chat-view">` | ~Lines 950–1050 |
| **JavaScript logic** (encryption, chat, WebSocket) | `<script>` tag | ~Lines 1050–1841 |

#### Quick examples:

**Want to change the app's main color?** Edit line 26:
```css
--accent-primary: #7c3aed;   /* ← Change this hex color */
```

**Want to change the page title?** Edit line 6:
```html
<title>Private Chatroom — Anonymous E2E Encrypted Messaging</title>
```

**Want to change the lock emoji or brand name?** Search for `brand` in the HTML section (~line 820).

### ⚙️ Backend — [server.js](file:///d:/Projects/Private%20Chatroom/server.js)

| What you want to change | Where to look | Lines |
|---|---|---|
| **Port number** | `const PORT = ...` | Line 7 |
| **Rate limiting** (messages per second) | `ws._rateWindow.length > 30` | Line 72 |
| **Room validation** | `roomId.length < 16` | Line 48 |
| **Message relay logic** | `ws.on('message', ...)` | Lines 65–90 |

> [!TIP]
> **Pro tip:** Use `Ctrl+F` in your editor to search for text you see on the website. For example, search for `"Anonymous"` to find where the tagline is defined.

---

## 2️⃣ How to Share the Full Source Code

### Option A: Share as a ZIP file (Simplest)

1. **Right-click** the `d:\Projects\Private Chatroom` folder
2. Select **"Compress to ZIP file"** (or "Send to → Compressed folder")
3. **⚠️ IMPORTANT:** Before zipping, **delete the `node_modules` folder** — it's huge and unnecessary (the other person can regenerate it)
4. Send the `.zip` file via email, Google Drive, WhatsApp, Discord, etc.

The other person then:
```
1. Unzip the file
2. Open a terminal in that folder
3. Run: npm install       ← This recreates node_modules
4. Run: npm start         ← This starts the server
```

### Option B: Use GitHub (Professional way)

**Step 1 — Create a `.gitignore` file** to exclude `node_modules`:
```
node_modules/
```

**Step 2 — Push to GitHub:**
```powershell
cd "d:\Projects\Private Chatroom"
git init
git add .
git commit -m "Initial commit"
```
Then create a repository on [github.com](https://github.com), and follow the instructions to push.

**Step 3 — Share the GitHub link** with anyone. They can clone it:
```bash
git clone https://github.com/YOUR_USERNAME/private-chatroom.git
cd private-chatroom
npm install
npm start
```

> [!TIP]
> GitHub is the best way to share code — it also gives you version control so you can undo mistakes.

---

## 3️⃣ How to Start & Stop the Server

### ▶️ To START the server:

Open a terminal in the project folder and run:
```powershell
cd "d:\Projects\Private Chatroom"
npm start
```

You'll see:
```
Private Chatroom relay running on port 3000
```

Then open your browser to **http://localhost:3000**

### ⏹️ To STOP the server:

Press **`Ctrl + C`** in the terminal where the server is running.

That's it! The terminal will stop the process.

> [!NOTE]
> If you close the terminal window, the server also stops automatically.

### Common issues:

| Problem | Solution |
|---|---|
| `Port 3000 is already in use` | Another instance is running. Press `Ctrl+C` in the other terminal, or run: `npx kill-port 3000` |
| `Cannot find module 'ws'` | Run `npm install` first to install dependencies |
| Page shows error | Make sure the server is running (check the terminal for the "running" message) |

---

## 4️⃣ How Others Can Access Your Website

### 🏠 Right now: Only YOU can access it

`localhost:3000` only works on **your own computer**. Nobody else can reach it.

### 🌐 Option A: Share on your local Wi-Fi network

If the other person is on the **same Wi-Fi** as you:

1. Find your local IP address:
   ```powershell
   ipconfig
   ```
   Look for **IPv4 Address** (something like `192.168.1.105`)

2. Tell the other person to visit:
   ```
   http://192.168.1.105:3000
   ```

> [!WARNING]
> This only works if both computers are on the same Wi-Fi/network. It will NOT work over the internet.

### 🌍 Option B: Use ngrok (Quick way to go public — free)

[ngrok](https://ngrok.com/) creates a temporary public URL that tunnels to your localhost:

1. Download & install ngrok from https://ngrok.com/download
2. Start your server first: `npm start`
3. In a **second terminal**, run:
   ```powershell
   ngrok http 3000
   ```
4. ngrok gives you a public URL like:
   ```
   https://abc123.ngrok-free.app
   ```
5. **Share that URL** with anyone in the world!

> [!NOTE]
> The free tier gives you a temporary URL that changes every time. The URL only works while your computer is on and ngrok is running.

### ☁️ Option C: Deploy to the cloud (Permanent — recommended)

For a **permanent** website that's always online, deploy to a cloud platform:

| Platform | Cost | How to deploy |
|---|---|---|
| **[Render](https://render.com)** | Free tier available | Connect GitHub repo → auto-deploys |
| **[Railway](https://railway.app)** | Free tier available | Connect GitHub repo → auto-deploys |
| **[Fly.io](https://fly.io)** | Free tier available | CLI deployment with `flyctl launch` |
| **[Heroku](https://heroku.com)** | Paid ($5/mo) | Connect GitHub repo → auto-deploys |

The general process:
1. Push your code to GitHub (see Section 2, Option B)
2. Sign up on one of these platforms
3. Connect your GitHub repo
4. The platform deploys it and gives you a permanent URL like `your-app.onrender.com`

> [!IMPORTANT]
> Since your app uses **WebSockets** (`ws` library), make sure the hosting platform supports WebSocket connections. Render, Railway, and Fly.io all do.

---

## Quick Reference Card

| I want to... | Do this |
|---|---|
| **Edit colors/fonts** | Edit CSS variables in [index.html](file:///d:/Projects/Private%20Chatroom/public/index.html) lines 18–44 |
| **Edit page content** | Edit HTML in [index.html](file:///d:/Projects/Private%20Chatroom/public/index.html) ~lines 810–1050 |
| **Edit chat behavior** | Edit JS in [index.html](file:///d:/Projects/Private%20Chatroom/public/index.html) ~lines 1050–1841 |
| **Edit server logic** | Edit [server.js](file:///d:/Projects/Private%20Chatroom/server.js) |
| **Change the port** | Edit [server.js](file:///d:/Projects/Private%20Chatroom/server.js) line 7 |
| **Start the server** | `npm start` in terminal |
| **Stop the server** | `Ctrl + C` in terminal |
| **Share code as ZIP** | Delete `node_modules/`, then zip the folder |
| **Share code via GitHub** | `git init` → `git add .` → `git commit` → push to GitHub |
| **Let friends on Wi-Fi access** | Share your local IP: `http://YOUR_IP:3000` |
| **Let anyone on internet access** | Use ngrok or deploy to Render/Railway |
