import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { register, login } from './controllers/authController.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import grnRoutes from './routes/grnRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import { salesRoutes, purchaseRoutes } from './routes/orderRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { productRoutes, partyRoutes } from './routes/simpleRoutes.js';

import Product from './models/Product.js';
import { Customer, Supplier } from './models/Party.js';

import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://erp-management-system-iota.vercel.app'
    ]
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'ERP Management API',
    version: '1.0.0'
  });
});

// Health
app.use('/api/health', healthRoutes);

// Authentication
app.use('/api/auth', authRoutes);
app.post('/api/register', register);
app.post('/api/login', login);

// Users
app.use('/api/users', userRoutes);

// Dashboard
app.use('/api/dashboard', dashboardRoutes);

// Products
app.use('/api/products', productRoutes(Product));

// Customers
app.use(
  '/api/customers',
  partyRoutes(Customer, ['Admin', 'Sales'])
);

// Suppliers
app.use(
  '/api/suppliers',
  partyRoutes(Supplier, ['Admin', 'Purchase'])
);

// Sales Orders
app.use('/api/sales-orders', salesRoutes());

// Purchase Orders
app.use('/api/purchase-orders', purchaseRoutes());

// GRN
app.use('/api/grn', grnRoutes);

// Invoices
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;