# ShopSphere

ShopSphere is a learning-focused e-commerce project built to explore
backend development, REST APIs, database design, and modern frontend
development.

## Technology Stack

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv

## Current Features

- Express REST API
- Retrieve all products
- Retrieve a product by ID
- Create products
- Update products
- Delete products
- Basic request validation
- MySQL connection pooling
- Parameterized SQL queries

## Prerequisites

- Node.js
- npm
- MySQL Server

## Backend Setup

1. Navigate to the backend directory:

   `cd backend`

2. Install dependencies:

   `npm install`

3. Create a `.env` file using `.env.example` as a reference.

4. Create the `shopsphere_db` database and the required products table.

5. Start the backend:

   `node server.js`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Retrieve all products |
| GET | /api/products/:id | Retrieve one product |
| POST | /api/products | Create a product |
| PUT | /api/products/:id | Update a product |
| DELETE | /api/products/:id | Delete a product |

## Project Status

Backend development in progress.