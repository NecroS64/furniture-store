const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Получить список пользовательской мебели (только для админов)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно. Возвращает список мебели.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Furniture'
 *       403:
 *         description: Доступ запрещен. Только для администраторов.
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get("/", authenticateToken, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  try {
    const [rows] = await pool.query("SELECT furniture.*, admin_users.username FROM furniture LEFT JOIN admin_users ON furniture.user_id = admin_users.id WHERE furniture.isCustom = true;");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * @swagger
 * /api/admin/filter:
 *   get:
 *     summary: Фильтрация пользовательской мебели по параметрам
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Тип мебели (например, 'sofa', 'cabinet')
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Цвет мебели
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *         description: Ширина в см
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: Высота в см
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *         description: Глубина в см
 *     responses:
 *       200:
 *         description: Успешно. Возвращает массив отфильтрованной мебели.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Furniture'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get("/filter", async (req, res) => {
  const { type, color, width, height, depth } = req.query;

  let query = "SELECT furniture.*, admin_users.username FROM furniture LEFT JOIN admin_users ON furniture.user_id = admin_users.id WHERE furniture.isCustom = true";
  const params = [];

  if (type) {
    query += " AND furniture.type = ?";
    params.push(type);
  }

  if (color) {
    query += " AND furniture.color = ?";
    params.push(color);
  }

  if (width) {
    query += " AND furniture.width = ?";
    params.push(Number(width));
  }

  if (height) {
    query += " AND furniture.height = ?";
    params.push(Number(height));
  }

  if (depth) {
    query += " AND furniture.depth = ?";
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


router.delete("/delete/:id", authenticateToken, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  const id = req.params.id;

  try {
    await pool.query("DELETE FROM furniture WHERE id = ?", [id]);
    res.json({ message: "Удалено" });
  } catch (err) {
    console.error("Ошибка при удалении:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;

