const awsServerlessExpress = require("aws-serverless-express");
const app = require("./server");
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
// DcPhvXAYQ0A2nM+H4RCxZmwzT1VgjQLIjozH/mvk
