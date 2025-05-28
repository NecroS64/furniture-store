const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../db");

const router = express.Router();

router.post(
  "/login",
  body("username").isString(),
  body("password").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    const [users] = await pool.query("SELECT * FROM admin_users WHERE username = ?", [username]);
    const user = users[0];
    if (!user) return res.status(401).json({ message: "Неверные данные" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Неверные данные" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  }
);

module.exports = router;
