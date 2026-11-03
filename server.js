const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "Okay" }));
  }

  if (req.url === "/db") {
    try {
      const result = await pool.query("SELECT NOW() AS time");
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ database: "connected", time: result.rows[0].time }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ database: "not connected", error: error.message }));
    }
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from My DevOps practice app!. This app is running on docker");
});

// Only start listening when this file is run directly (node server.js),
// not when a test file imports it.
if (require.main === module) {
  server.listen(PORT, () => console.log(`App running on port ${PORT}`));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

module.exports = server;

// Stop the app cleanly when Docker (or Ctrl + C) asks it to stop
function shutdown() {
  console.log("Stopping the app...");
  server.close(() => {
    pool.end();
    process.exit(0);
  });
}