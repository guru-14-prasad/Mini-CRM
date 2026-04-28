const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "crm",
  password: "your_password",
  port: 5432,
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});