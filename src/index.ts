// console.log("Hello via Bun!");
import "dotenv/config";
import express from "express";
import paymentRoutes from "./routes/payment.routes";

const app = express();
const port = parseInt(process.env.port || "3000", 10);

// Middleware para leer JSON
app.use(express.json());

// Monstamos las rutas bajo /api/payments
app.use("/api/payments", paymentRoutes);

// Iniciar servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
