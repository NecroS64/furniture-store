const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const furnitureRoutes = require("./routes/furniture");
const customFurnitureRoutes = require("./routes/customFurniture");
const adminRoutes = require("./routes/admin");
//node index.js



const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Адрес фронтенда
  credentials: true // Если используешь cookie
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/furniture", furnitureRoutes);
app.use("/customFurniture", customFurnitureRoutes);
app.use("/api/admin", adminRoutes);



const PORT =  3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
