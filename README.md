# LUXE Store — Full-Stack E-Commerce Platform

A feature-rich, high-performance E-Commerce platform built with **Node.js/Express**, **MySQL** (with automated mock DB fallback), **React (Vite)**, and **Vanilla CSS**.

---

## 🌟 Key Features

- **🛍️ 200+ Products Catalog**: 25+ detailed items across 8 categories (*Smartphones & Tech, Laptops, Fashion, Beauty, Sports, Food, Toys, Home & Living*).
- **❤️ Wishlist System**: Instant optimistic heart icon toggle, synchronized with backend `wishlist_items` schema.
- **🛒 Cart Drawer**: Slide-in sidebar with free shipping progress bar, quantity controls, and subtotal calculation.
- **🔐 Flexible Authentication**:
  - Seamless Sign In for any email address with on-the-fly user creation.
  - **1-Click Google Sign In** with an interactive Google Account Selector Modal.
- **🏡 Address Selection & Payment Gateways**:
  - Saved delivery addresses (*Home / Office*) + New address form.
  - Payment modes: **Google Pay (GPay UPI)**, **Paytm / PhonePe**, **Credit/Debit Card**, and **Cash on Delivery (COD)**.
- **🎉 Order Success Screen**: Celebration modal with order tracking details & delivery estimates.
- **🌐 5-Language Translation (i18n)**: English (US), Tamil (தமிழ்), Hindi (हिंदी), Spanish (Español), and French (Français).
- **👤 Account Settings Modal**: Edit profile, order history, language selector, and notification toggles.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd ecommerce-backend
npm install
npm start
```
*Backend server runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd ecommerce-frontend
npm install
npm run dev
```
*Frontend app runs on `http://localhost:3000`*
