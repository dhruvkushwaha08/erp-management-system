# ERP REST API

Base URL: `http://localhost:5000/api`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` — authenticated

## Users (Admin)
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

## Products
- `GET /products?page=1&limit=10&search=laptop`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Customers
- `GET /customers`
- `GET /customers/:id`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id`

## Suppliers
- `GET /suppliers`
- `GET /suppliers/:id`
- `POST /suppliers`
- `PUT /suppliers/:id`
- `DELETE /suppliers/:id`

## Sales Orders
- `GET /sales-orders`
- `GET /sales-orders/:id`
- `POST /sales-orders`
- `PUT /sales-orders/:id`
- `POST /sales-orders/:id/complete`

## Purchase Orders
- `GET /purchase-orders`
- `GET /purchase-orders/:id`
- `POST /purchase-orders`
- `PUT /purchase-orders/:id`

## GRN
- `GET /grn`
- `POST /grn`

## Invoices
- `GET /invoices`
- `GET /invoices/:id`
- `POST /invoices`
- `PATCH /invoices/:id/status`
- `GET /invoices/:id/pdf`

## Dashboard
- `GET /dashboard`

## Health
- `GET /health`

All protected endpoints require:

```text
Authorization: Bearer <JWT>
```
