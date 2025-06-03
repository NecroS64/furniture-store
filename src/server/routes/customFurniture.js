const express = require("express");
const router = express.Router();
const pool = require("../db");

const authenticateToken = require("../middleware/authMiddleware");
/**
 * @swagger
 * /api/customFurniture:
 *   post:
 *     summary: Сохранить или обновить пользовательскую мебель
 *     tags:
 *       - CustomFurniture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID мебели (для обновления, опционально)
 *               type:
 *                 type: string
 *                 description: Тип мебели
 *                 example: chair
 *               name:
 *                 type: string
 *                 description: Название мебели
 *                 example: Стул
 *               width:
 *                 type: integer
 *                 example: 50
 *               height:
 *                 type: integer
 *                 example: 100
 *               depth:
 *                 type: integer
 *                 example: 45
 *               color:
 *                 type: string
 *                 example: red
 *               description:
 *                 type: string
 *                 example: Удобный стул для кухни
 *               material:
 *                 type: string
 *                 example: дерево
 *               shelves:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     heightPercent:
 *                       type: integer
 *                       example: 30
 *                     color:
 *                       type: string
 *                       example: white
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     color:
 *                       type: string
 *                       example: black
 *     responses:
 *       200:
 *         description: Модель мебели успешно сохранена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Model saved successfully
 *                 id:
 *                   type: integer
 *                   example: 123
 *       401:
 *         description: Неавторизованный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to save model
 */
router.post("/", authenticateToken, async (req, res) => {
  const model = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    const {
      id,
      type,
      name,
      width,
      height,
      depth,
      color,
      description,
      material,
      shelves = [],
      seats = [],
    } = model;

    const [result] = await conn.query(
      `INSERT INTO furniture (type, name, width, height, depth, color, description, material, isCustom, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         type=VALUES(type),
         name=VALUES(name),
         width=VALUES(width),
         height=VALUES(height),
         depth=VALUES(depth),
         color=VALUES(color),
         description=VALUES(description),
         material=VALUES(material),
         isCustom=VALUES(isCustom),
         user_id=VALUES(user_id)`,
      [
        type,
        name,
        width,
        height,
        depth,
        color,
        description,
        material,
        true,        // isCustom = true
        userId       // id_user
      ]
    );

    const furnitureId = id || result.insertId;

    // Удаляем старые полки/сиденья
    await conn.query("DELETE FROM shelves WHERE furniture_id = ?", [furnitureId]);
    await conn.query("DELETE FROM seats WHERE furniture_id = ?", [furnitureId]);

    // Добавляем полки
    for (const shelf of shelves) {
      await conn.query(
        "INSERT INTO shelves (furniture_id, heightPercent, color) VALUES (?, ?, ?)",
        [furnitureId, shelf.heightPercent, shelf.color]
      );
    }

    // Добавляем сиденья
    for (const seat of seats) {
      await conn.query(
        "INSERT INTO seats (furniture_id, color) VALUES (?, ?)",
        [furnitureId, seat.color]
      );
    }

    await conn.commit();
    res.json({ message: "Model saved successfully", id: furnitureId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to save model" });
  } finally {
    conn.release();
  }
});

module.exports = router;
