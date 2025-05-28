const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const furnitureRoutes = require("./routes/furniture");

const app = express();
app.use(cors());
app.use(express.json());

// ❗ Убедитесь, что authRoutes и furnitureRoutes — функции (Express Router)
app.use("/api/auth", authRoutes);
app.use("/api/furniture", furnitureRoutes);

const PORT =  3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
