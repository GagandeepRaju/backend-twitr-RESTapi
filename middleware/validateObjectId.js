const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.userid))
    return res.status(404).send("Invalid ID.");

  next();
};
