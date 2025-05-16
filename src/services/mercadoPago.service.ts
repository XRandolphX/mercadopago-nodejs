import { Preference } from "mercadopago";
import { mpClient } from "../config/mercadopago";
import { isTemplateExpression } from "typescript";

// Interfaces para representar la estructura de datos de la app Android
interface Product {
  id: string;
  name: string;
  price: number;
  offerPercentage?: number;
  images: string[];
}

interface CartProduct {
  product: Product;
  quantity: number;
  selectedColor?: number; // Cambiado a number según la definición en Android
  selectedSize?: string;
}

interface Address {
  fullName: string;
  location: string; // En tu app Android se llama location
  addressBill: string; // En tu app Android se llama addressBill
  phone: string;
}

// Esta interfaz refleja lo que envía la app Android
interface PaymentRequest {
  products: CartProduct[];
  totalPrice: number;
  address: Address;
}

const preferenceApi = new Preference(mpClient);

export const createMercadoPagoPreference = async (
  paymentRequest: PaymentRequest
) => {
  console.log(
    "Creando preferencia con datos:",
    JSON.stringify(paymentRequest, null, 2)
  );

  // Transformamos los datos de la app al formato que espera MercadoPago
  const mercadoPagoItems = paymentRequest.products.map((cartProduct, index) => {
    const actualPrice = cartProduct.product.offerPercentage
      ? cartProduct.product.price *
        (1 - cartProduct.product.offerPercentage / 100)
      : cartProduct.product.price;

    return {
      id: cartProduct.product.id || `item_${Date.now()}_${index}`,
      title: cartProduct.product.name,
      quantity: cartProduct.quantity,
      unit_price: actualPrice,
      currency_id: "PEN", // Moneda peruana (soles)
      picture_url: cartProduct.product.images[0] || "",
    };
  });

  // Recalcular el total en el backend
  const calculatedTotal = mercadoPagoItems.reduce((acc, item) => {
    return acc + item.unit_price * item.quantity;
  }, 0);

  // Comparar con el total recibido
  if (Math.abs(calculatedTotal - paymentRequest.totalPrice) > 0.01) {
    throw new Error(
      `EL precio total no coincide. Calculado: ${calculatedTotal}, Recibido: ${paymentRequest.totalPrice}`
    );
  }

  // Creamos la estructura que espera MercadoPago
  const preferenceData = {
    items: mercadoPagoItems,
    payer: {
      email: "cliente@elegantcommerce.com", // Podrías pasar este dato desde la app
      name: paymentRequest.address.fullName,
      phone: {
        number: paymentRequest.address.phone,
      },
      address: {
        street_name: paymentRequest.address.addressBill,
        zip_code: "00000", // Valor por defecto si no tienes código postal
      },
    },
    external_reference: "order_" + Date.now(),
    back_urls: {
      success: "elegantcommerce://payment/success",
      failure: "elegantcommerce://payment/failure",
      pending: "elegantcommerce://payment/pending",
    },
    auto_return: "approved",
    notification_url:
      process.env.NOTIFICATION_URL ||
      "https://hook.us1.make.com/your-webhook-id", // URL para webhooks
  };

  console.log(
    "Enviando datos a MercadoPago:",
    JSON.stringify(preferenceData, null, 2)
  );

  // Llamamos a la API de MercadoPago con los datos transformados
  try {
    const result = await preferenceApi.create({ body: preferenceData });
    console.log("Preferencia creada con éxito:", result.id);
    return result;
  } catch (error) {
    console.error("Error al crear preferencia en MercadoPago:", error);
    throw error;
  }
};
