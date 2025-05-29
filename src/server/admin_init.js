const bcrypt = require("bcrypt");
const pool = require("./db");

const createAdmin = async () => {
  const username = "user2";
  const password = "user2"; 
  const hash = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)", [username, hash]);
  console.log("Admin created");
};

createAdmin();
