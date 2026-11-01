# 💧 AquaPay - Water Money Collection System

A modern, fast, mobile-friendly Water Bill Collection and Accounting system designed specifically for **physical door-to-door water money collection** with **Section-wise area organization (Sections A to I)** and a **complete running balance ledger**.

---

## 🚀 How to Run the App

1. Double-click on:
   👉 **[`run.bat`](file:///C:/Users/ADMIN/.gemini/antigravity/scratch/water-collection-system/run.bat)** *(or open [`index.html`](file:///C:/Users/ADMIN/.gemini/antigravity/scratch/water-collection-system/index.html) in Google Chrome / your browser)*
2. If already open in your browser, press **F5** (or **Ctrl + R**) to reload!

---

## 🌐 Cloud Hosting & Smartphone Sync (Option 2)

The system includes a ready-to-deploy backend server (`server.js`) and REST API:
- **Central Cloud Database**: When you host on **Render** or **Railway**, all payments and rooms you add from your smartphone are saved to `data/database.json` on the server.
- **Real-Time PC Sync**: Open the site on your laptop or home PC, and everything collected on your phone is automatically there in real time!
- **Offline Resilience**: If phone internet drops inside a building, the phone saves to offline memory and auto-syncs as soon as internet reconnects.
- Detailed step-by-step deployment instructions:
  👉 Read **[`HOSTING_GUIDE.md`](file:///C:/Users/ADMIN/.gemini/antigravity/scratch/water-collection-system/HOSTING_GUIDE.md)**

---

## 🏢 Section-Wise Organization (Sections A to I)

Rooms in your area are arranged in **alphabetical + numerical order** (`A1, A2...`, `B1, B2...` up to Section `I`):
- **Section Tabs Bar (A to I)**: Quick pills at the top to filter into `Section A`, `Section B`, ..., `Section I`, or view `🏢 All Sections (A - I)`.
- **Organized Section Blocks**: Rooms are grouped under distinct section containers with section statistics (Collected vs. Pending) instead of being mixed in one big flat list.
- **Section Room Counters**: Each section tab shows the live count of rooms registered in that wing.
- **Smart Auto-Increment for Fast Manual Entry**:
  - Selecting Section B automatically suggests `B1` (or next room `B2`, `B3`...).
  - Clicking **`Save & Add Next House ❯`** keeps you in that same section and auto-increments the room number, focusing immediately on the resident name so you can enter all ~60 houses in minutes!
- **Empty Section Guides**: Sections without rooms yet display an easy `+ Add First Room to Section X (X1)` card.

---

## 📅 Starting Month: November 2026

The system starts from **November 2026** (current billing cycle):
- Zero dummy data: Clean slate ready for your real rooms (Sections A to I).
- The month selector opens directly on **November 2026**.

---

## 🧮 How the Running Balance Logic Works (Cumulative Ledger)

The system automatically manages past unpaid balances, partial payments, and full clearances across months:

### 1. When a resident pays LESS than the bill (Shortfall):
- **November 2026**:
  - Water Bill: **₹250**
  - Resident gives: **₹200**
  - Shortfall remaining: **₹50** (Status: **PARTIAL**)

### 2. When they pay in the NEXT month (Balance is added to new bill):
- **December 2026**:
  - Past Dues carried from November: **₹50**
  - December Water Bill: **₹250**
  - 👉 **TOTAL PAYABLE IN DECEMBER**: **₹300** (`₹50 + ₹250`)

### 3. If they pay LESS again (Balances accumulate):
- If the resident only gives **₹150** in December:
  - Total Payable was **₹300**
  - Amount Paid: **₹150**
  - 👉 **NEW REMAINING BALANCE**: **₹150** (carried over to January!)

### 4. If they pay the WHOLE amount (All dues cleared):
- If the resident gives the full **₹300** in December:
  - Total Payable: **₹300**
  - Amount Paid: **₹300**
  - 👉 **NEW REMAINING BALANCE**: **₹0** (Status: **ALL DUES CLEARED**)
  - In January, past dues will show **₹0**!

### 5. If they pay only the current bill (₹250):
- Total Payable was **₹300**
- Amount Paid: **₹250**
- 👉 **NEW REMAINING BALANCE**: **₹50** (The past ₹50 remains due!)

---

## ⚡ Quick Action Buttons in Payment Window:
When you open a room's payment window, the system automatically shows:
- **`[Pay Full (₹300)]`**: Clears both past balance + current bill in 1 click!
- **`[Pay Bill Only (₹250)]`**: Pays just this month's bill, keeping the old balance active.
- **`[Mark Unpaid (₹0)]`**: Carries the full total forward as pending.

---

## 📱 100% Responsive on Any Device & Browser

The application is fully optimized for **smartphones, tablets, laptops, and desktops** across all modern browsers (**Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari on iPhone/iPad/Mac, Android Webview, Samsung Internet**):
- **Door-to-Door Walk Ergonomics**: Touch targets are comfortably sized (minimum 42-44px) so you can tap them easily while walking outside with one hand.
- **Swipeable Section Tabs**: Swipe through Sections A to I smoothly on your phone screen with your thumb.
- **iOS Safari Safe**: Form inputs are calibrated so iPhone/iPad Safari will not disrupt your zoom level while typing names.
- **Adaptive Modal Dialogs**: Add Room and Payment windows adapt into clean mobile sheets with single-column inputs on smartphones.
- **Horizontal Table Scrolling**: Switch between Cards view and Table view without breaking page layout.

---

## 🛡️ Multi-Layer Data Safety (Your Important Data Is Never Lost)

Your collection records and house details are protected with **multi-tier safety systems**:

1. **Dual Storage Layers (LocalStorage + IndexedDB)**:
   Every change is automatically written to both `localStorage` and `IndexedDB` persistent storage. If one storage area is ever cleared by a generic cache-cleaning tool, the system automatically recovers your complete database from the persistent IndexedDB backup!
2. **Browser Persistent Storage (`navigator.storage.persist()`)**:
   The app requests persistent storage privilege from the browser, instructing Chrome/Safari/Edge to never evict your data under disk pressure.
3. **Live Auto-Save Indicator**:
   The top bar displays a live green badge (`🟢 Auto-Saved & Safe`) showing the exact timestamp of your latest save.
4. **Automatic Safety Snapshots (Emergency Restore)**:
   The system automatically preserves rolling historical snapshots. You can view or restore previous snapshots directly from **Settings & Backup**!
5. **1-Click Physical Backup File (`💾 Save Backup File`)**:
   Tap the button in the header anytime to download a timestamped `.json` file. You can save this file on your phone, PC, USB drive, Google Drive, or send it to your WhatsApp!
6. **Protected Reset**:
   Accidental clicks cannot reset your database: resetting requires explicitly typing the confirmation word `RESET`.

---

## 📜 Full Account Ledger History:
Click **`📜 History`** on any room card to see a transparent ledger table showing:
`Billing Month | Past Dues | Month Bill | Total Payable | Amount Paid | Remaining Balance | Status`

---
## To view the live Site
Visit : Aquapay.yors.online 
