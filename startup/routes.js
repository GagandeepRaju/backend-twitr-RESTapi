const express = require("express");
const user = require("../routes/user");
const login = require("../routes/login");
const homepage = require("../routes/homepage");
const chat = require("../routes/chat");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", user);
  app.use("/api/login", login);
  app.use("/api/homepage", homepage);
  app.use("/api/chat", chat);
};
