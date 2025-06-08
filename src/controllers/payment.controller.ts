import type { Request, Response, RequestHandler } from "express";
import { createMercadoPagoPreference } from "../services/mercadoPago.service";
import { mpClient, mpPayment } from "../config/mercadopago";

// Controlador de prueba para probar la ruta GET
export const helloPayment = (_req: Request, res: Response) => {
  res.json({ message: "¡Api de pagos funcionando v2.x! 🚀" });
};

// Controlador para crear una preferencia de pago en MercadoPago
export const createPayment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const paymentRequest = req.body;
    console.log("Datos Recibidos:", JSON.stringify(paymentRequest, null, 2));
    // Validar si se recibieron los datos necesarios
    if (
      !paymentRequest.products ||
      !paymentRequest.totalPrice ||
      !paymentRequest.address
    ) {
      res.status(400).json({
        error: "Faltan datos requeridos",
        message: "Se requiere products, totalPrice y address",
      });
      return;
    }

    // Crear preferencia en MercadoPago
    const preference = await createMercadoPagoPreference(paymentRequest);

    // Enviar la respuesta con el init_point
    res.status(200).json({
      init_point: preference.init_point,
      id: preference.id,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("no coincide")) {
      console.error("Validación de precio fallida: ", error.message);
      res.status(400).json({
        error: "Precio inválido",
        message: error.message,
      });
      return;
    }

    console.error(
      "Error al crear preferencia de pago: ",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({
      error: "Error al procesar el pago",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const mercadoPagoWebhookHandler: RequestHandler = async (req, res) => {
  const event = req.body;

  console.log("📩 Webhook recibido:", JSON.stringify(event, null, 2));

  if (event.type === "payment" && event.data?.id) {
    try {
      const payment = await mpPayment.get({ id: event.data.id });

      console.log("💰 Detalle del pago:", JSON.stringify(payment, null, 2));

      if (payment.status === "approved") {
        console.log("✅ Pago aprobado con ID:", payment.id);
        // I can save later to Firestore
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("❌ Error al obtener detalle del pago:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(200);
  }
};
