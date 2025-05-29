const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
// Получение всех предметов мебели
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
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM furniture WHERE isCustom=false");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Фильтрация мебели
/**
 * @swagger
 * /api/furniture/filter:
 *   get:
 *     summary: Получить список стандартной мебели по фильтрам
 *     tags:
 *       - Furniture
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Тип мебели
 *         example: chair
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Цвет мебели
 *         example: red
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *         description: Ширина мебели
 *         example: 50
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: Высота мебели
 *         example: 120
 *       - in: query
 *         name: depth
 *         schema:
 *           type: integer
 *         description: Глубина мебели
 *         example: 40
 *     responses:
 *       200:
 *         description: Список мебели, соответствующий фильтрам
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Furniture'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
router.get("/filter", async (req, res) => {
  const { type, color, width, height, depth } = req.query;

  let query = "SELECT * FROM furniture WHERE isCustom = false";
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

// Получение всей пользовательской мебели
/**
 * @swagger
 * /api/furniture/custom:
 *   get:
 *     summary: Получить список собственной кастомной мебели пользователя
 *     tags:
 *       - Furniture
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список кастомной мебели
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Furniture'
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.get("/custom",authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log("UserId:", userId);
    const [rows] = await pool.query("SELECT * FROM furniture WHERE isCustom = true AND user_id = ?",[userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Получение одного предмета по ID
/**
 * @swagger
 * /api/furniture/{id}:
 *   get:
 *     summary: Получить мебель по ID (включая полки или сиденья при наличии)
 *     tags:
 *       - Furniture
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор мебели
 *         example: 42
 *     responses:
 *       200:
 *         description: Мебель с дополнительными данными (полки или сиденья)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Furniture'
 *                 - type: object
 *                   properties:
 *                     shelves:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Shelf'
 *                     seats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Seat'
 *       404:
 *         description: Мебель не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [furnitureRows] = await pool.query("SELECT * FROM furniture WHERE id = ?", [id]);

    if (furnitureRows.length === 0) {
      return res.status(404).json({ error: "Furniture not found" });
    }

    const furniture = furnitureRows[0];

    // Загружаем дополнительные данные в зависимости от типа
    if (furniture.type === "шкаф") {
      const [shelves] = await pool.query("SELECT id, heightPercent, color FROM shelves WHERE furniture_id = ?", [id]);
      furniture.shelves = shelves;
    } else if (furniture.type === "диван") {
      const [seats] = await pool.query("SELECT id, color FROM seats WHERE furniture_id = ?", [id]);
      furniture.seats = seats;
    }

    res.json(furniture);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
