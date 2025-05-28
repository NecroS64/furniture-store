
const bcrypt = require("bcrypt");
const pool = require("./db");

(async () => {
  const password = "admin123"; // установи свой пароль
  const hash = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)", [
    "admin",
    hash,
  ]);
  console.log("Admin user created");
  process.exit();
})();
