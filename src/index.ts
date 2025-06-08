// Load environment variables from .env file only in non-production environments
if (process.env.NODE_ENV !== "production") {
  console.log("Cargando variables desde .env");
  require("dotenv").config();
}

// Import core dependencies
import express from "express";
import paymentRoutes from "./routes/payment.routes";

// Log environment variables only in development (for debugging purposes)
if (process.env.NODE_ENV !== "production") {
  console.log("MP_ACCESS_TOKEN:", process.env.MP_ACCESS_TOKEN);
  console.log("PORT:", process.env.PORT);
}

// Validate that the required Mercado Pago access token is defined
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN no está definido en el entorno");
}

// Define port (Railway provides one dynamically, fallback to 8080 for local development)
const port = parseInt(process.env.PORT || "8080", 10);

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register payment-related routes under the /api/payments prefix
app.use("/api/payments", paymentRoutes);

// Root route for health check and server status
app.get("/", (_req, res) => {
  res.send("Servidor funcionando 💻");
});

// Start the server and listen on the specified port
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
