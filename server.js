const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./db");
const { createUserTable } = require("./models/userModel");

const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Database Tables
createUserTable();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatbotRoutes);

// Start Server
const port = 5000;
app.listen(port, () => { // Listen on all network interfaces
    console.log(`Server is running on http://192.168.75.9:${port}`);
});
