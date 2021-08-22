const express = require("express");
const router = express.Router();
const _ = require("lodash");
const path = require("path");
const validateObjId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { User, validation, genToken } = require("../models/user");

//user active friend-list
router.get("/:_id", async (req, res) => {
  let user = await User.findById({ _id: req.params._id })
    .populate("following", "_id name email")
    .populate("followers", "_id name email");

  if (!user) return res.status(400).send("Can't find user in the database.");

  res.status(200).send(_.pick(user, ["_id", "followers", "following"]));
});

// homepage/chatbox for the chat feature
router.get("/", (req, res) => {
  res.sendFile("chat.html", {
    root: path.join(__dirname, "../public/"),
  });
});

module.exports = router;
