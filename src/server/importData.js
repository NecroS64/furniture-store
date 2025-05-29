const fs = require('fs');
const mysql = require('mysql2/promise');

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'furniture_app'
  });

  const json = JSON.parse(fs.readFileSync('../../db.json', 'utf8'));

  for (const item of json.furniture.concat(json.furniture)) {
    const {
      id, type, name, width, height, depth, color,
      description, material, size, shelves, seats, images
    } = item;

    // await connection.execute(`
    //   INSERT INTO furniture (id, type, name, width, height, depth, color, description, material)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    //   ON DUPLICATE KEY UPDATE name=VALUES(name)
    // `, [id, type, name || null, width || null, height || null, depth || null, color || null, description || null, material || item.config?.material || null]);

    // if (Array.isArray(shelves)) {
    //   for (const s of shelves) {
    //     await connection.execute(
    //       `INSERT INTO shelves (furniture_id, heightPercent, color) VALUES (?, ?, ?)`,
    //       [id, s.heightPercent, s.color]
    //     );
    //   }
    // }

    if (Array.isArray(seats)) {
      for (const s of seats) {
        await connection.execute(
          `INSERT INTO seats (furniture_id, color) VALUES (?,  ?)`,
          [id, s.color]
        );
      }
    }

    
  }

  console.log('Data imported successfully!');
  await connection.end();
})();
