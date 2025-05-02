import { MercadoPagoConfig } from "mercadopago";

// Inicializamos el cliente Mercado Pago
export const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
    options: {timeout: 5000},
});

