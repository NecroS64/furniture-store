const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM furniture WHERE isCustom=true");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/filter", async (req, res) => {
  const { type, color, width, height, depth } = req.query;

  let query = "SELECT * FROM furniture WHERE isCustom = true";
  const params = [];

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  if (color) {
    query += " AND color = ?";
    params.push(color);
  }

  if (width) {
    query += " AND width = ?";
    params.push(Number(width));
  }

  if (height) {
    query += " AND height = ?";
    params.push(Number(height));
  }

  if (depth) {
    query += " AND depth = ?";
    params.push(Number(depth));
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Ошибка при фильтрации:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
