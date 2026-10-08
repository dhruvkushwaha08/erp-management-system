# ERP Management System

A full-stack Enterprise Resource Planning (ERP) web application developed using the MERN stack. The system provides centralized management of products, customers, suppliers, sales orders, purchase orders, inventory, GRNs, invoices, users, authentication, and role-based access control.

## 🚀 Live Application

**Frontend:**  
https://erp-management-system-iota.vercel.app

**Backend API:**  
https://erp-management-system-phm6.onrender.com

The application is deployed using:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📌 Project Overview

The ERP Management System is designed to manage essential business operations through a centralized web application.

The system supports:

- Product management
- Customer management
- Supplier management
- Sales order management
- Purchase order management
- Goods Receipt Notes (GRN)
- Inventory management
- Invoice generation
- PDF invoice generation
- User management
- Authentication and authorization
- Role-based access control
- Dashboard and business statistics

The application follows a modular full-stack architecture with a React frontend, Node.js/Express backend, and MongoDB database.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- Material UI
- Axios
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- PDFKit
- Morgan
- CORS

### Database

- MongoDB
- MongoDB Atlas
- Mongoose ODM

### Development & Deployment

- IntelliJ IDEA
- Git
- GitHub
- Docker
- Vercel
- Render
- MongoDB Atlas

---

## ✨ Features

### 🔐 Authentication

- User login
- JWT-based authentication
- Protected routes
- Secure password hashing
- Role-based authorization
- Automatic handling of expired/invalid sessions

### 📦 Product Management

- Add products
- Edit products
- Delete products
- View product inventory
- Track stock quantity
- Monitor low-stock products

### 👥 Customer Management

- Create customers
- Update customers
- Delete customers
- View customer information

### 🏢 Supplier Management

- Create suppliers
- Update suppliers
- Delete suppliers
- View supplier information

### 🛒 Sales Orders

Complete sales workflow:

```text
Customer
   ↓
Sales Order
   ↓
Order Completion
   ↓
Inventory Stock Deduction
   ↓
Invoice
   ↓
PDF Invoice