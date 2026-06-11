const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

// 1. Configure CORS policies once
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// 2. Configure high limit body parsers once (Crucial for Base64 posters)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Static assets and route endpoints
app.use(express.static("public"));
app.use("/api", userRoutes);

// 4. Database Initialization
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
  
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started at port:", PORT);
});