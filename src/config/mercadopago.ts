import { MercadoPagoConfig } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MP_ACCESS_TOKEN no está definido en el archivo .env");
}

// Inicializamos el cliente Mercado Pago
export const mpClient = new MercadoPagoConfig({
  accessToken,
  options: { timeout: 5000 },
});
