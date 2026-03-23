const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Port setup
const PORT = 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});