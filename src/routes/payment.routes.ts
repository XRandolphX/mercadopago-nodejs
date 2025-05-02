import { Router } from "express";
import { helloPayment, createPayment } from "../controllers/payment.controller";

const router = Router();

// Prueba GET -> /api/payments/
router.get("/", helloPayment);

// Crear un pago POST -> /api/payments/create
router.post("/create", createPayment);

export default router;
