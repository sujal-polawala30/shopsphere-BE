
require("dotenv").config();

const express = require("express");
const pool = require("./db/pool");
const { validateProduct } = require("./utils/product-validation");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ShopSphere API!",
    status: "success",
  });
});

// READ: Get all products
app.get("/api/products", async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT id, name, price, created_at
       FROM products
       ORDER BY id ASC`
    );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Fetch products failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
});

// READ: Get one product
app.get("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const [products] = await pool.execute(
      `SELECT id, name, price, created_at
       FROM products
       WHERE id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: products[0],
    });
  } catch (error) {
    console.error("Fetch product failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
});

// CREATE: Add a product
app.post("/api/products", async (req, res) => {
  const errors = validateProduct(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const { name, price } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO products (name, price)
       VALUES (?, ?)`,
      [name.trim(), Number(price)]
    );

    const [products] = await pool.execute(
      `SELECT id, name, price, created_at
       FROM products
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: products[0],
    });
  } catch (error) {
    console.error("Create product failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
});

// UPDATE: Replace editable product fields
app.put("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const errors = validateProduct(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  const { name, price } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE products
       SET name = ?, price = ?
       WHERE id = ?`,
      [name.trim(), Number(price), id]
    );

    if (result.affectedRows === 0) {
      const [existing] = await pool.execute(
        "SELECT id FROM products WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    const [products] = await pool.execute(
      `SELECT id, name, price, created_at
       FROM products
       WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: products[0],
    });
  } catch (error) {
    console.error("Update product failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
});

// DELETE: Remove a product
app.delete("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const [result] = await pool.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
});

// Start server only after verifying the database connection
async function startServer() {
  try {
    const connection = await pool.getConnection();
    connection.release();

    app.listen(PORT, () => {
      console.log(`ShopSphere API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
