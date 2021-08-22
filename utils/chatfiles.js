var jwt = require("jsonwebtoken");

// Get room users
function decode(token) {
  return jwt.decode(token);
}

module.exports = jwt;
