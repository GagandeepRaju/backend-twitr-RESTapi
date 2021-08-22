const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, genToken } = require("../models/user");
const express = require("express");
const router = express.Router();
const path = require("path");
//login get
router.get("/", async (req, res) => {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../public/"),
  });
});

// login request
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.hashed_password
  );

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = genToken(_.pick(user, ["_id", "name", "email"]));
  res.setHeader("x-auth-token", token);
  res.status(200).send(_.pick(user, ["_id", "name"]));
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  const result = schema.validate(user);
  return result;
}

module.exports = router;
