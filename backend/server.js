const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "crm",
  password: "Guru@2007",
  port: 5432,
});

// Test route
app.post("/leads", async (req, res) => {
  try {
    const { name, phone, source } = req.body;

    const result = await pool.query(
      "INSERT INTO leads (name, phone, source) VALUES ($1, $2, $3) RETURNING *",
      [name, phone, source]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting data");
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});