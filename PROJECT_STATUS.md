# Project Status

This package is the complete implementation baseline for the assigned ERP specification.

Implemented:
- React/Vite frontend
- Express 5 backend
- MongoDB/Mongoose persistence
- JWT authentication
- bcrypt password hashing
- role-based authorization
- users, products, customers, suppliers
- sales orders
- purchase orders
- GRN and stock receiving
- sales stock deduction
- invoices and PDF generation
- dashboard and low-stock visibility
- pagination/search for master data
- centralized API error handling
- API documentation
- seed data
- backend health test

Business rules deliberately made explicit because the assignment did not specify them:
- Sales stock is deducted when a Sales Order is completed.
- A sales order must be completed before an invoice can be generated.
- GRN increases product stock.
- A GRN cannot receive more than the ordered quantity for an item in one receipt.
- A purchase order is marked Received after a GRN is created.
- Completed/cancelled sales orders and received/cancelled purchase orders are not editable.

These rules can be changed if the internship evaluator gives different business instructions.
