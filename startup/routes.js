const express = require("express");
const user = require("../routes/user");
const login = require("../routes/login");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", user);
  app.use("/api/login", login);
};
