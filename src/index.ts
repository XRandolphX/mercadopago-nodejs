// console.log("Hello via Bun!");
import "dotenv/config";
import express from "express";
import paymentRoutes from "./routes/payment.routes";

const app = express();
const port = process.env.port || 3000;

// Middleware para leer JSON
app.use(express.json());

// Monstamos las rutas bajo /api/payments
app.use("/api/payments", paymentRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
