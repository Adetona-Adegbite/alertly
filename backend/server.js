const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

sequelize
  .authenticate()
  .then(() => {
    const port = process.env.PORT || 3000;
    https
      .createServer(options, app)
      .listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// Adegbite12..
// 3306;
