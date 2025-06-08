import { Router } from "express";
import { helloPayment, createPayment } from "../controllers/payment.controller";
import { mercadoPagoWebhookHandler } from "../controllers/payment.controller";

const router = Router();

// Prueba GET -> /api/payments/
router.get("/", helloPayment);

// Crear un pago POST -> /api/payments/create
router.post("/create", createPayment);

// Webhook endpoint to receive asynchronous payment notifications from Mercado Pago
router.post("/webhook", mercadoPagoWebhookHandler);

export default router;
