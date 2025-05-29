const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/furniture", authenticateToken, async (req, res) => {
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

module.exports = router;
