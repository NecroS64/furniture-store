const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const model = req.body;

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

    // Сохраняем или обновляем мебель
    const [result] = await conn.query(
  `INSERT INTO furniture ( type, name, width, height, depth, color, description, material, isCustom)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     type=VALUES(type),
     name=VALUES(name),
     width=VALUES(width),
     height=VALUES(height),
     depth=VALUES(depth),
     color=VALUES(color),
     description=VALUES(description),
     material=VALUES(material),
     isCustom=VALUES(isCustom)`,
  [ type, name, width, height, depth, color, description, material, true] // true для кастомной мебели
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
