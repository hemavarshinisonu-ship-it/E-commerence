# 🛒 LUXE Store — Full-Stack E-Commerce Platform

A production-ready, feature-rich E-Commerce web application built with **React (Vite)**, **Node.js**, **Express**, **MySQL / In-Memory Mock Database**, and **Vanilla CSS**.

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express_4-000000?logo=express)](https://expressjs.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?logo=render)](https://render.com/)

---

## 🌟 Key Features

* **🛍️ 200+ Products & 8 Categories**: Extensive collection spanning *Smartphones & Tech, Laptops, Fashion, Beauty, Sports & Fitness, Food & Healthcare, Toys, and Home & Living*.
* **❤️ Interactive Wishlist**: Instant heart toggle synchronized with user accounts.
* **🛒 Cart Drawer Sidebar**: Live item management, quantity adjustment, subtotal calculation, and free-shipping progress tracker.
* **🔐 Google 1-Click Sign In**: Integrated Google Account selector modal alongside email authentication.
* **🏡 Address & Checkout Management**: Saved delivery addresses (*Home / Office*), new address form, and multiple payment methods:
  * **Google Pay (GPay UPI)**
  * **Paytm / PhonePe**
  * **Credit / Debit Card**
  * **Cash on Delivery (COD)**
* **🎉 Order Success Celebration**: Instant tracking details modal with delivery estimates upon checkout.
* **🌐 5-Language i18n Translation**: Multi-language support for **English**, **Tamil (தமிழ்)**, **Hindi (हिंदी)**, **Spanish (Español)**, and **French (Français)**.
* **👤 Account Management**: Profile editing, order history, language switcher, and notification controls.

---

## 📁 Repository Structure

```text
E-commerence/
├── ecommerce-backend/             # Express API Server
│   ├── config/                    # DB connection setup
│   ├── controllers/               # Route logic handlers
│   ├── middleware/                # Auth & helper middleware
│   ├── models/                    # Data models & mock storage
│   ├── routes/                    # API endpoints
│   ├── server.js                  # Entry point
│   └── package.json
│
├── ecommerce-frontend/            # React + Vite Frontend
│   ├── src/
│   │   ├── api/                   # Axios API configuration
│   │   ├── components/            # UI components (Navbar, Cart, Modals)
│   │   ├── context/               # Global state (Auth, Wishlist, Language)
│   │   ├── data/                  # Product catalog dataset
│   │   ├── App.jsx                # Main application view
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 💻 Local Development Setup

### 1. Backend Setup
```bash
cd ecommerce-backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd ecommerce-frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## ☁️ Deploying on Render

This project deploys on Render using **2 services**:

### 1. Web Service (Backend)
* **Root Directory:** `ecommerce-backend`
* **Build Command:** `npm install`
* **Start Command:** `node server.js`
* **Environment Variables:**
  * `JWT_SECRET` = `your_jwt_secret_key`
  * `NODE_ENV` = `production`

### 2. Static Site (Frontend)
* **Root Directory:** `ecommerce-frontend`
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`
* **Environment Variables:**
  * `VITE_API_URL` = `https://<YOUR-RENDER-BACKEND-NAME>.onrender.com/api`
* **Redirects / Rewrites Rule:**
  * Source: `/*` ➔ Destination: `/index.html` (Action: `Rewrite`)

---

## ⚡ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products / filter by category |
| `POST` | `/api/auth/login` | User authentication & auto-registration |
| `GET` | `/api/wishlist/:userId` | Get user wishlist items |
| `POST` | `/api/wishlist/toggle` | Add/Remove product from wishlist |
| `POST` | `/api/orders` | Place a new order |

---

## 📄 License
MIT License © 2026 LUXE Store Team.
