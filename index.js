const express = require("express");
const app = express();

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config.js")();

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server is runnong on ${port}`)
);

module.exports = server;
