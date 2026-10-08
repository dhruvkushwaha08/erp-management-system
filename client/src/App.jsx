import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Parties from './pages/Parties';
import Orders from './pages/Orders';
import GRN from './pages/GRN';
import Invoices from './pages/Invoices';
import Users from './pages/Users';

const protect = (element, roles) => (
  <ProtectedRoute roles={roles}>
    {element}
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={protect(<Layout />)}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/customers"
          element={<Parties type="customers" title="Customers" />}
        />

        <Route
          path="/suppliers"
          element={<Parties type="suppliers" title="Suppliers" />}
        />

        <Route
          path="/sales-orders"
          element={<Orders type="sales" title="Sales Orders" />}
        />

        <Route
          path="/purchase-orders"
          element={<Orders type="purchase" title="Purchase Orders" />}
        />

        <Route path="/grn" element={<GRN />} />

        <Route path="/invoices" element={<Invoices />} />

        <Route
          path="/admin"
          element={protect(<Users />, ['Admin'])}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}