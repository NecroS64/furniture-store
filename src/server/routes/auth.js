// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();




const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Успешный выход, токен удалён
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 *       401:
 *         description: Неверный логин или пароль
 */
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

 
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "Lax",
    })
    .json({ isAdmin: payload.isAdmin });
});


module.exports = router;




module.exports = router;

