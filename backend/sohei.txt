const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const pool = require("./db/db"); // Mengimport koneksi pool dari db.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Menyajikan file statis dari folder frontend

// Login route using database
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query untuk memeriksa apakah username dan password ada di tabel admin
    const result = await pool.query(
      "SELECT * FROM admin WHERE username = $1 AND password = $2",
      [username, password]
    );

    // Jika ada hasil, berarti login berhasil
    if (result.rows.length > 0) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Error during login process" });
  }
});

// Route to fetch data from database
app.get("/api/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admin");
    res.status(200).json(result.rows); // Mengirim hasil query sebagai JSON
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Error fetching data from database" });
  }
});

// Rute untuk mengembalikan halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html")); // Mengembalikan file index.html
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
