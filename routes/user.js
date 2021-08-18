const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validation, genToken } = require("../models/user");
// const validateObjId = require("../middleware/validateObjectId");
const fs = require("fs");

//creating new user account
router.post("/", async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already Registered!");
  try {
    user = new User(_.pick(req.body, ["name", "email"]));
    const salt = await bcrypt.genSalt(10);
    user.hashed_password = await bcrypt.hash(req.body.password, salt);
    user.about = "";
    await user.save();
    const token = genToken(_.pick(user, ["_id", "name", "email"]));
    res
      .header("x-auth-token", token)
      .header("acess-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (ex) {
    res.status(400).send(ex);
  }
});

module.exports = router;
