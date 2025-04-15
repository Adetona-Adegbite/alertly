const sequelize = require("./config/database");
const Subscription = require("./models/subscriptions");
const News = require("./models/news");

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => console.log(err));
