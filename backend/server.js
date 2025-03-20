const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiRoutes);

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
