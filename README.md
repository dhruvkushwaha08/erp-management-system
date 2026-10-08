# ERP Management System — MERN Stack

A full-stack ERP web application built from the assigned internship specification. It manages products, customers, suppliers, sales orders, purchase orders, goods receipt notes (GRN), invoices, inventory, authentication and role-based users.

## Stack
- Frontend: React + Vite, React Router, Material UI, Axios, React Hook Form-ready structure
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- PDF: PDFKit
- Testing: Jest + Supertest
- Development: IntelliJ IDEA / any Node-compatible IDE

## Required software
- Node.js 20+ (Node 24 is supported)
- npm
- Docker Desktop (recommended for MongoDB)

## 1. Install
From the project root:

```powershell
npm install
npm run install-all
```

## 2. Environment files
Copy:

```text
server/.env.example -> server/.env
client/.env.example -> client/.env
```

The supplied local defaults work with Docker MongoDB.

## 3. Start MongoDB

```powershell
docker compose up -d mongodb
```

Check:

```powershell
docker ps
```

You should see `erp-mongodb` running.

## 4. Seed demo data

```powershell
npm run seed
```

Demo admin:

```text
Email:    admin@erp.local
Password: Admin@123
```

The seed also creates sample products, a customer and a supplier.

## 5. Run the application

```powershell
npm run dev
```

Open:

- Frontend: http://localhost:5173
- API: http://localhost:5000
- Health: http://localhost:5000/api/health

## ERP workflows

### Sales
Customer → Sales Order → Complete Order → Stock deduction → Invoice → PDF

### Purchasing
Supplier → Purchase Order → GRN → Stock increase

### Security
Login → JWT → protected routes → backend role authorization

## Roles
- Admin: full access + user management
- Sales: customers, sales orders, invoices
- Purchase: suppliers, purchase orders, products
- Inventory: products, GRN, inventory operations

## API documentation
See `API.md` for the endpoint map.

## Tests

```powershell
npm test
```

## Production notes
- Never commit `.env` files or real secrets.
- Change `JWT_SECRET` before deployment.
- Set `MONGODB_URI`, `CLIENT_URL` and frontend `VITE_API_URL` for production.
- The frontend can be deployed to Vercel and the API to Render, matching the assignment's target deployment model.

## Submission
Before submitting to Classroom:

```powershell
git init
git add .
git commit -m "Complete ERP management system"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

Do not commit `.env`, credentials, or database dumps.

## Postman
Import `postman_collection.json` into Postman. After logging in, copy the returned JWT into the collection's `token` variable.
