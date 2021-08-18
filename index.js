const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from twitter server");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server is runnong on ${port}`)
);

module.exports = server;
