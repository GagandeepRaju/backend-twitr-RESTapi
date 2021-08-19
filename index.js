const express = require("express");
const app = express();

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config.js")();
require("./startup/validation")();

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server is runnong on ${port}`)
);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Client connected");
});

module.exports = server;
