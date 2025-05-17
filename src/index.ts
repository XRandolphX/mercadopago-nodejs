// Cargar dotenv solo en desarrollo local
if (process.env.NODE_ENV !== "production") {
  console.log("Cargando variables desde .env");
  require("dotenv").config();
}

// Importar express y las rutas
import express from "express";
import paymentRoutes from "./routes/payment.routes";

// Solo loguear en desarrollo
if (process.env.NODE_ENV !== "production") {
  console.log("MP_ACCESS_TOKEN:", process.env.MP_ACCESS_TOKEN);
  console.log("PORT:", process.env.PORT);
}

// Validar que el Access Token esté definido
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN no está definido en el entorno");
}

// Definir el puerto
const port = parseInt(process.env.PORT || "3000", 10);

// Crear la app
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Definir las rutas
app.use("/api/payments", paymentRoutes);

// Iniciar servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
