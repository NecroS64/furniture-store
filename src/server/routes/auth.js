// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();


// routes/auth.js

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [[user]] = await pool.query("SELECT * FROM admin_users WHERE username = ?", [username]);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const payload = {
    userId: user.id,
    login: user.username,
    isAdmin: user.isAdmin === 1,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  // ⬅️ УСТАНАВЛИВАЕМ cookie
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // ⬅️ должно быть true, если используется HTTPS
      sameSite: "Lax",
    })
    .json({ isAdmin: payload.isAdmin });
});


module.exports = router;




module.exports = router;

