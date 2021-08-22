const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const moment = require("moment");

/*
User Schema name, email, password is required keys
*/

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now(),
  },
  about: {
    type: String,
    trim: true,
  },
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);
/*
User validation based on their key name, types, length, required or not required information
*/
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    about: Joi.string(),
  });
  const result = schema.validate(user);
  return result;
}
/*
Json web token for user validation and session maintenance purposes
*/
function generateAuthToken(user) {
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    config.get("jwtPrivateKey")
  );
  return token;
}

exports.User = User;
exports.validation = validateUser;
exports.genToken = generateAuthToken;
