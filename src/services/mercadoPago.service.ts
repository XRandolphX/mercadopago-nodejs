import { Preference } from "mercadopago";
import { mpClient } from "../config/mercadopago";

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
  selectedColor?: number;
  selectedSize?: string;
}

interface Address {
  fullName: string;
  location: string;
  addressBill: string;
  phone: string;
}

// Esta interfaz refleja lo que envía la app Android
interface PaymentRequest {
  products: CartProduct[];
  totalPrice: number;
  address: Address;
  userEmail?: string;
}

function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
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
    const basePrice = cartProduct.product.price;
    const offerPercentage = cartProduct.product.offerPercentage || 0;

    const discountedPrice = basePrice * (1 - offerPercentage);
    const actualPrice = roundToTwoDecimals(discountedPrice);

    return {
      id: cartProduct.product.id || `item_${Date.now()}_${index}`,
      title: cartProduct.product.name,
      quantity: cartProduct.quantity,
      unit_price: actualPrice,
      currency_id: "PEN",
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
      email: paymentRequest.userEmail || "cliente@elegantcommerce.com",
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
      success: "https://payment-pages-five.vercel.app/payment/success.html",
      failure: "https://payment-pages-five.vercel.app/payment/failure.html",
      pending: "https://payment-pages-five.vercel.app/payment/pending.html",
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
