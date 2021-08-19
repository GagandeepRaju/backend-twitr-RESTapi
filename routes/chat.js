const express = require("express");
const router = express.Router();
const path = require("path");

const auth = require("../middleware/auth");

router.get("/:id", (req, res) => {
  res.sendFile("index.html", {
    root: path.join(__dirname, "../public/"),
  });
});

module.exports = router;
