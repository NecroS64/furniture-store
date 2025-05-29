const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const furnitureRoutes = require("./routes/furniture");
const customFurnitureRoutes = require("./routes/customFurniture");
const adminRoutes = require("./routes/admin");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
//node index.js



const app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true 
}));
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Furniture API",
      version: "1.0.0",
      description: "Документация для API мебельного магазина",
    },
    components: {
      schemas: {
        Furniture: {
          type: "object",
          properties: {
            id: { type: "integer" },
            type: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            width: { type: "integer" },
            height: { type: "integer" },
            depth: { type: "integer" },
            color: { type: "string" },
            material: { type: "string" },
            hasArmrests: { type: "boolean" },
            legsMaterial: { type: "string" },
            isCustom: { type: "boolean" },
            id_user: { type: "integer", nullable: true }
          },
        },
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js"], // где находятся описания API (аннотации)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/furniture", furnitureRoutes);
app.use("/api/customFurniture", customFurnitureRoutes);
app.use("/api/admin", adminRoutes);




const PORT =  3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
