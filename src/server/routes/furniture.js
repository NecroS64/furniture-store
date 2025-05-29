const express = require("express");
const router = express.Router();
const pool = require("../db");

// Получение всех предметов мебели
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
router.get("/custom", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM furniture WHERE isCustom = true");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Получение одного предмета по ID
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
