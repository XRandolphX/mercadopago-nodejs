import type { Request, Response, RequestHandler } from "express";
import { createMercadoPagoPreference } from "../services/mercadoPago.service";

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
  } catch (error: any) {
    if (error.message.includes("no coincide")) {
      res.status(400).json({
        error: "Precio inválido",
        message: error.message,
      });
      return;
    }

    console.error("Error al crear preferencia de pago: ", error);

    res.status(500).json({
      error: "Error al procesar el pago",
      message: error.message,
    });
  }
};
