const mongoose = require("mongoose");

/*
 A tweet schema postedBy key is used for foreign key of user, both in original tweet as well as comment section
like key is used for foriegn key array of other users
 */

const PostSchema = new mongoose.Schema({
  text: { type: String, required: "Name is required" },
  photo: { type: String },
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  created: { type: Date, default: Date.now },
});

const Tweets = mongoose.model("tweets", PostSchema);

exports.Tweets = Tweets;
