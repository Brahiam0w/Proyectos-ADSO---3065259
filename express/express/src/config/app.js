import express from "express";
import dotenv from "dotenv";
import { pool } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🔮 API Numerología funcionando correctamente");
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
