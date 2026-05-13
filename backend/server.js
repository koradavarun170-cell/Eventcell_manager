const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRoutes);
const PORT = 5000;
const MONGO_URI = "mongodb://koradavarun170_db_user:varun%40123@ac-mp1fncf-shard-00-00.ugwqidw.mongodb.net:27017,ac-mp1fncf-shard-00-01.ugwqidw.mongodb.net:27017,ac-mp1fncf-shard-00-02.ugwqidw.mongodb.net:27017/hotel-booking?ssl=true&replicaSet=atlas-4ffwoa-shard-0&authSource=admin&appName=cluster1";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("server started at port:", PORT);
});