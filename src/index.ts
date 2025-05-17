// Solo cargar dotenv si NO está en producción
if (process.env.NODE_ENV !== "production") {
  console.log("Cargando variables desde .env");
  require("dotenv").config();
}

// Importar express y las rutas
import express from "express";
import paymentRoutes from "./routes/payment.routes";

// Mostrar variables solo en desarrollo
if (process.env.NODE_ENV !== "production") {
  console.log("MP_ACCESS_TOKEN:", process.env.MP_ACCESS_TOKEN);
  console.log("PORT:", process.env.PORT);
}

// Validar que MP_ACCESS_TOKEN esté definido (tanto en Railway como local)
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN no está definido en el entorno");
}

// Definir el puerto, Railway lo gestiona, usa 3000 por defecto en local
const port = parseInt(process.env.PORT || "3000", 10);

// Crear la app
const app = express();

// Middleware para JSON
app.use(express.json());

// Definir rutas
app.use("/api/payments", paymentRoutes);

// Ruta raíz para verificar que el servidor está funcionando
app.get("/", (_req, res) => {
  res.send("Servidor funcionando 💻");
});

// Iniciar servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
