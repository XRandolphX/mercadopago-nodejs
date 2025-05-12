# Elegant Commerce Payments API

> A simple Express.js service integrating Mercado Pago v2.x to create payment preferences (init_point) for seamless checkout flows.

---

## 📋 Table of Contents

- [🔍 Project Overview](#-project-overview)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)

  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)

- [🛠️ Usage](#️-usage)

  - [Running the Server](#running-the-server)
  - [Endpoints](#endpoints)

    - [GET /api/payments](#get-apipayments)
    - [POST /api/payments/create](#post-apipaymentscreate)

- [👤 Author](#-author)
- [📄 License](#-license)

---

## 🔍 Project Overview

This repository contains a minimal Express.js application written in modern ES modules, bundled with Bun compatibility, providing endpoints to:

- **Say hello** (`GET /api/payments`)
- **Create a Mercado Pago payment preference** (`POST /api/payments/create`)

You'll receive back the `init_point` URL that redirects your users to the hosted checkout.

> _Note:_ This is a learning project aimed at demonstrating a basic integration with Mercado Pago’s v2.x SDK in Node.js.

---

## ⚙️ Tech Stack

- **Node.js** (>=14)
- **Bun** (optional)
- **Express.js**
- **TypeScript** (only for the Mercado Pago client config)
- **Mercado Pago SDK v2.x**

---

## 🚀 Getting Started

### Prerequisites

- Install [Node.js](https://nodejs.org/) (v14 or above) or use [Bun](https://bun.sh/) as your runtime
- A Mercado Pago account and an _Access Token_

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/elegantcommerce-payments.git
   cd elegantcommerce-payments
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

### Configuration

1. Create a `.env` file in the project root:

   ```env
   MP_ACCESS_TOKEN=YOUR_MERCADOPAGO_ACCESS_TOKEN
   PORT=3000
   ```

2. Ensure your token has the proper scopes to create payment preferences.

---

## 🛠️ Usage

### Running the Server

Start the server with:

```bash
npm start
# or
bun run src/index.js
```

By default, it listens on the port specified in `.env` (`3000` if not provided).

### Endpoints

#### GET /api/payments

- **Description:** Health-check or greeting endpoint.
- **Request:**

  ```http
  GET http://localhost:3000/api/payments
  ```

- **Response:**

  ```json
  "¡Hola mundo desde pagos v2.x! 🚀"
  ```

#### POST /api/payments/create

- **Description:** Creates a Mercado Pago payment preference and returns the `init_point`.
- **Request:**

  ```http
  POST http://localhost:3000/api/payments/create
  Content-Type: application/json

  {
    "title": "Producto de prueba",
    "quantity": 1,
    "unit_price": 100,
    "currency_id": "PEN",
    "payer_email": "test_user@example.com"
  }
  ```

- **Response:**

  ```json
  {
    "id": "1234567890",
    "init_point": "https://www.mercadopago.com/init_point_url"
  }
  ```

- **Error Handling:** Returns status `500` with a JSON error message if something goes wrong.

---

## 👤 Author

- **Randolph Ramirez Palacios** • [randolphfrp@gmail.com](mailto:randolphfrp@gmail.com) • [GitHub Profile](https://github.com/XRandolphX)
