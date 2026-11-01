# 🌐 Cloud Hosting & Smartphone Sync Guide - AquaPay

This guide explains how to host **AquaPay** on the internet for **free** using **Cloudflare** (with your own custom domain), and how smartphone and PC sync works.

---

## 📱 How Cloud Sync Works (Smartphone + Central Database)

```
┌─────────────────────────┐               ┌────────────────────────────────────────┐
│  📱 Your Smartphone     │               │  ☁️ Cloudflare Pages / Central Cloud   │
│  (Door-to-Door Walk)    │               │  (aquapay.yourdomain.com)              │
│                         │  POST /api/data│                                        │
│  • Record ₹250 Payment  ├──────────────►│  • Saves to Central Cloud Database     │
│  • Add Rooms (A1, B1..) │               │  • Creates rolling safety backups      │
│  • Offline Memory (IDB) │◄──────────────┤                                        │
└─────────────────────────┘  GET /api/data └───────────────────┬────────────────────┘
                                                               │
                                                               │ GET /api/data
                                                               ▼
                                                  ┌─────────────────────────┐
                                                  │  💻 Your Laptop / PC    │
                                                  │  (At Home / Office)     │
                                                  │                         │
                                                  │  • Sees phone records   │
                                                  │  • Prints sheets & CSV  │
                                                  └─────────────────────────┘
```

1. **Door-to-Door Collection**: When you collect money on your phone, AquaPay saves it to the central database in real-time.
2. **Offline Resilience**: If you lose mobile signal inside a staircase or basement, your phone saves records in **IndexedDB offline cache**. When signal returns, it automatically syncs with the server.
3. **Live Sync with PC**: Open `https://aquapay.yourdomain.com` on your computer to view, audit, and print receipts or Excel/CSV spreadsheets.

---

## ⚡ Option 1: 100% Inside Cloudflare (Recommended - Pages + KV)

Since your domain is already managed by Cloudflare, you can host **both the frontend and backend database 100% inside Cloudflare for free**! No external servers needed, zero spin-down sleep delays, and instant global speed.

### Step 1: Upload Project to GitHub
1. Create a free account at [github.com](https://github.com) (if you don't have one).
2. Create a new repository (e.g. `aquapay`).
3. Push/upload this folder to the repository (make sure `index.html` and the `functions/` folder are included).

### Step 2: Create a Free Database in Cloudflare (KV)
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **Workers & Pages** &rarr; **KV**.
3. Click **Create a namespace**:
   - Namespace Name: `AQUAPAY_KV`
   - Click **Add**.

### Step 3: Deploy Frontend to Cloudflare Pages
1. In Cloudflare, go to **Workers & Pages** &rarr; **Overview**.
2. Click **Create application** &rarr; choose the **Pages** tab.
3. Click **Connect to Git** and select your `aquapay` GitHub repository.
4. Set the build configuration:
   - **Framework preset**: `None`
   - **Build command**: *(leave blank)*
   - **Build output directory**: `/` *(or leave blank)*
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy your site in ~30 seconds!

### Step 4: Link the Database (KV Binding)
1. On your Cloudflare Pages project page, click the **Settings** tab.
2. Select **Functions** from the left menu.
3. Scroll down to **KV namespace bindings** and click **Add binding**:
   - **Variable name**: `AQUAPAY_KV` *(must be exact)*
   - **KV namespace**: select `AQUAPAY_KV` from the dropdown.
4. Click **Save**.
5. Click **Deployments** &rarr; click the three dots (`...`) on your latest deployment &rarr; click **Retry deployment** (so the KV binding takes effect).

### Step 5: Connect Your Domain
1. In your Pages project, click the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter your domain or subdomain (e.g., `aquapay.yourdomain.com` or `water.yourdomain.com`).
4. Because your domain is already on Cloudflare, Cloudflare will automatically add the DNS record and provision an SSL certificate in one click!

🎉 **Done!** Open `https://aquapay.yourdomain.com` on your smartphone and laptop. Data will be saved directly into Cloudflare's global KV database.

---

## 🚀 Option 2: Cloudflare Domain CNAME &rarr; Render.com

If you prefer to run the Node.js server (`server.js`) on Render and have it show under your Cloudflare domain:

1. **Deploy on Render**:
   - Connect your GitHub repo to [render.com](https://render.com) as a **Web Service**.
   - Build Command: `npm install` | Start Command: `node server.js` | Plan: `Free`.
   - Render gives you a URL like `https://aquapay-xyz.onrender.com`.
2. **Add Custom Domain in Render**:
   - In Render Web Service &rarr; **Settings** &rarr; scroll to **Custom Domains** &rarr; Click **Add Custom Domain** &rarr; enter `aquapay.yourdomain.com`.
3. **Add DNS Record in Cloudflare**:
   - In your Cloudflare Dashboard &rarr; select your domain &rarr; **DNS** &rarr; **Records**.
   - Click **Add record**:
     - **Type**: `CNAME`
     - **Name**: `aquapay`
     - **Target**: `aquapay-xyz.onrender.com`
     - **Proxy status**: `Proxied` (Orange Cloud)
   - Click **Save**.

Your app is now live at `https://aquapay.yourdomain.com` powered by Render with Cloudflare's CDN and SSL!

---

## 🔗 Option 3: Cloudflare Pages (Frontend) + Separate Backend API

If you deploy static frontend on Cloudflare Pages and backend on another URL:
1. Deploy frontend to Cloudflare Pages.
2. Deploy backend (`server.js`) to Render / Railway / VPS.
3. Open AquaPay &rarr; Click **⚙️ Settings** &rarr; Paste your backend URL into **`🌐 Central Backend API Server URL`** (e.g. `https://my-backend.onrender.com`) &rarr; Click **Save Settings**.
4. AquaPay will now automatically route all saves and syncs to that server!

---

## 📱 How to Install AquaPay as an App on Smartphone

Once hosted:
- **Android (Chrome)**: Open your URL &rarr; tap the 3 dots menu &rarr; tap **"Install App"** (or **"Add to Home screen"**).
- **iPhone (Safari)**: Open your URL &rarr; tap the Share button (square with arrow) &rarr; scroll down and tap **"Add to Home Screen"**.
