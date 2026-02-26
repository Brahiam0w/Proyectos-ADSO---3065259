import express from "express";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import pagoRoutes from "./routes/pagoRoutes.js";
import lecturaRoutes from "./routes/lecturaRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("🔮 API Numerología funcionando correctamente");
});

// Rutas de usuarios
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/lecturas", lecturaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
