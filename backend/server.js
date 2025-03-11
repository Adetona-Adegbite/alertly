const express = require("express");
const bodyParser = require("body-parser");
const paystackRoutes = require("./routes/paystack");
const sequelize = require("./config/database");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use("/api", paystackRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

sequelize
  .authenticate()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// Adegbite12..
// 3306;
