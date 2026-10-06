const express = require("express");
const pool = require("./db");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get("/products", async (req, res) => {
  const { search } = req.query;

  try {
    let queryText = "SELECT * FROM products";
    const queryParams = [];

    // التحقق من وجود search والتأكد أنه رقم صحيح
    if (search && !isNaN(search)) {
      queryText += " WHERE id = $1";
      queryParams.push(search);
    }

    queryText += " ORDER BY id ASC";

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/products/:id", async (req , res) => {
const { id } = req.params;
try {
	const result = await pool.query("select * from products where id = $1", [id]);
if (result.rows.length === 0) {
return res.status(400).send("Product not found");
}
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/products", async (req, res) => {
  const { name, price, description } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *",
      [name, price, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required for full update" });
  }

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, price, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {

    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name), 
           price = COALESCE($2, price), 
           description = COALESCE($3, description) 
       WHERE id = $4 
       RETURNING *`,
      [name !== undefined ? name : null, price !== undefined ? price : null, description !== undefined ? description : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json({ message: "Product deleted successfully", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
