const sequelize = require("./config/database");
const Subscription = require("./models/subscriptions");

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => console.log(err));
