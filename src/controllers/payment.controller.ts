import { type Request, type Response } from "express";
import { Preference } from "mercadopago";
import { mpClient } from "../config/mercadopago";

// Instanciamos la API de Order
const preferenceApi = new Preference(mpClient);

// Ruta de Prueba
export const helloPayment = (_req: Request, res: Response) => {
  res.send("¡Hola mundo desde pagos v2.x! 🚀");
};

// Crear una preferencia de pago (generar init_point)
export const createPayment = async (req: Request, res: Response) => {
  // LLamada a MercadoPago
  try {
    // Si quieres pasar datos dinámicos desde el body
    const {
      title = "Producto de prueba",
      quantity = 1,
      unit_price = 100,
      currency_id = "PEN",
      payer_email = "test_user@example.com",
    } = req.body;

    // Creamos un ID simple para el item
    const itemId = `item_${Date.now()}`;
    // Construcción del body según la API de Preference
    const result = await preferenceApi.create({
      body: {
        items: [
          {
            id: itemId,
            title,
            quantity,
            unit_price,
            currency_id,
          },
        ],
        payer: {
          email: payer_email,
        },
        external_reference: "order_" + Date.now(),
      },
    });
    // Respondemos con el id y el link de pago (init_point)
    res.json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (error: any) {
    console.error("Error al crear la preferencia: ", error);
    res
      .status(500)
      .json({ error: error.message || "Error interno del servidor" });
  }
};
