const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db");
const router = express.Router();

const REF_SECRET = process.env.REF_SECRET || "accessecrets";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя
 *     tags: [Auth]
 */
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
  }

  res.clearCookie("refreshToken", { path: "/" });
  res.status(200).json({ message: "Logged out" });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход пользователя
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const [[userDB]] = await pool.query("SELECT * FROM admin_users WHERE username = ?", [username]);
  if (!userDB || !(await bcrypt.compare(password, userDB.password_hash))) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const user = {
    id: userDB.id,
    isAdmin: userDB.isAdmin === 1,
  };

  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(user, REF_SECRET, { expiresIn: "7d" });

  await pool.query("INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)", [
    user.id,
    refreshToken,
  ]);

  res
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  .json({ accessToken, refreshToken, isAdmin: user.isAdmin });

});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление access и refresh токенов
 */
router.post("/refresh", async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).json({ error: "Нет refresh token" });
  }

  try {
    const [[dbToken]] = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = ?",
      [oldRefreshToken]
    );

    if (!dbToken) {
      return res.status(403).json({ error: "Refresh token не найден в базе" });
    }

    jwt.verify(oldRefreshToken, REF_SECRET, async (err, user) => {
      if (err) return res.status(403).json({ error: "Недействительный refresh token" });

      const payload = { id: user.id, isAdmin: user.isAdmin };
      const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
      const newRefreshToken = jwt.sign(payload, REF_SECRET, { expiresIn: "7d" });

      await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [oldRefreshToken]);
      await pool.query("INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)", [
        user.id,
        newRefreshToken,
      ]);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken, isAdmin: payload.isAdmin });

    });
  } catch (err) {
    console.error("Ошибка при refresh:", err);
    res.status(500).json({ error: "Ошибка сервера при обновлении токена" });
  }
});

module.exports = router;
