const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "database.json");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Initial clean database if database.json does not exist (0 dummy data)
const INITIAL_DB = {
  settings: {
    systemTitle: "AquaPay",
    societyName: "AquaPay",
    collectorName: "Manager",
    defaultMonthlyBill: 250,
    currency: "₹",
    apiUrl: ""
  },
  houses: [],
  collections: []
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf8");
}

// MIME types dictionary for static file serving
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

// Robust HTTP Server with REST API & Static Asset Serving
const server = http.createServer((req, res) => {
  // CORS Headers for any device (smartphone, laptop, tablet)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;

  // 1. Healthcheck Endpoint
  if (req.method === "GET" && (pathname === "/api/health" || pathname === "/health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. GET /api/data - Fetch the central database
  if (req.method === "GET" && pathname === "/api/data") {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(raw);
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(INITIAL_DB));
      }
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to read database file", message: err.message }));
    }
    return;
  }

  // 3. POST /api/data - Save updated database from Smartphone / PC
  if (req.method === "POST" && pathname === "/api/data") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      // Safety limit: 15MB max body size
      if (body.length > 15 * 1024 * 1024) {
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Payload too large" }));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        if (!parsed || !Array.isArray(parsed.houses)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid database structure: houses array required" }));
          return;
        }

        const formatted = JSON.stringify(parsed, null, 2);

        // Atomic write: write to temp file then rename to prevent corruption on crash
        const tempFile = DB_FILE + ".tmp";
        fs.writeFileSync(tempFile, formatted, "utf8");
        fs.renameSync(tempFile, DB_FILE);

        // Rolling server backup snapshot (keeps last 5 snapshots)
        try {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const backupPath = path.join(BACKUPS_DIR, `db_backup_${timestamp}.json`);
          fs.writeFileSync(backupPath, formatted, "utf8");

          const files = fs.readdirSync(BACKUPS_DIR)
            .filter(f => f.startsWith("db_backup_") && f.endsWith(".json"))
            .sort();
          while (files.length > 5) {
            const oldFile = files.shift();
            fs.unlinkSync(path.join(BACKUPS_DIR, oldFile));
          }
        } catch (backupErr) {
          console.warn("Notice: Snapshot creation failed:", backupErr.message);
        }

        console.log(`[${new Date().toLocaleTimeString()}] Saved database from client: ${parsed.houses.length} houses, ${parsed.collections ? parsed.collections.length : 0} collections.`);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          message: "Data saved successfully to central database",
          savedAt: new Date().toISOString()
        }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON received", message: err.message }));
      }
    });
    return;
  }

  // 4. GET /api/backup - Download direct database backup
  if (req.method === "GET" && pathname === "/api/backup") {
    try {
      if (fs.existsSync(DB_FILE)) {
        res.setHeader("Content-Disposition", `attachment; filename="water_collection_backup_${new Date().toISOString().slice(0, 10)}.json"`);
        res.writeHead(200, { "Content-Type": "application/json" });
        fs.createReadStream(DB_FILE).pipe(res);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Database file not found" }));
      }
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 5. Static Files Serving (Serve index.html and any local assets)
  let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  // If path doesn't exist, fallback to index.html (SPA routing support)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server Error loading asset");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("========================================================");
  console.log(`💧 Water Money Collection Server is RUNNING!`);
  console.log(`📍 Local Port: ${PORT}`);
  console.log(`📱 Smartphone / PC URL: http://localhost:${PORT}`);
  console.log(`💾 Central Database Path: ${DB_FILE}`);
  console.log("========================================================");
});
