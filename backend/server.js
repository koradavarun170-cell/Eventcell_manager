const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
  
app.listen(PORT, () => {
  console.log("server started at port:", PORT);
});
console.log("MONGO_URI:", process.env.MONGO_URI);
