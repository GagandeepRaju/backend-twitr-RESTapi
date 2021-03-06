const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjId = require("../middleware/validateObjectId");
const { Tweets } = require("../models/tweets");

//add comment
router.put("/addcomment", [auth], async (req, res) => {
  const { postId, text } = req.body;
  const postedBy = req.user._id;
  try {
    const tweet = await Tweets.findByIdAndUpdate(
      postId,
      { $push: { comments: { text: text, postedBy: postedBy } } },
      { new: true }
    );
    res.status(200).send(tweet);
  } catch (error) {
    res.status(200).send(error);
  }
});

//delete comment
router.put("/removecomment", [auth], async (req, res) => {
  //
  const { postId, commentId } = req.body;
  try {
    const tweet = await Tweets.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    res.status(200).send(tweet);
  } catch (error) {
    res.status(200).send(error);
  }
});

//add like
router.put("/addlike/:userid", [auth, validateObjId], async (req, res) => {
  //
  const postid = req.params.userid;
  const user = req.user._id;

  try {
    const tweet = await Tweets.findByIdAndUpdate(
      postid,
      { $push: { likes: user } },
      { new: true }
    );
    res.status(200).send(tweet);
  } catch (error) {
    res.status(200).send(error.message);
  }
});

//remove like
router.put("/removelike/:userid", [auth, validateObjId], async (req, res) => {
  //
  const _id = req.params.userid;
  try {
    const userid = req.user._id;
    const tweet = await Tweets.findByIdAndUpdate(
      _id,
      { $pull: { likes: userid } },
      { new: true }
    );
    res.status(200).send(tweet);
  } catch (error) {
    res.status(200).send(error);
  }
});

//Add tweet
router.post("/addtweet/:userid", [auth, validateObjId], async (req, res) => {
  //
  const user = await User.findOne({ _id: req.params.userid });
  if (!user) return res.status(400).send("Cannot find User");
  try {
    let tweet = new Tweets(_.pick(req.body, ["text", "postedBy"]));
    const result = await tweet.save();
    res.status(200).send(result);
  } catch (ex) {
    res.status(404).send(ex);
  }
});

//delete tweet
router.delete(
  "/deletetweet/:userid",
  [auth, validateObjId],
  async (req, res) => {
    const _id = req.params.userid;

    const tweet = await Tweets.findOne({ _id: _id });

    if (!tweet) return res.status(404).send("tweet was not found.");

    try {
      await Tweets.findByIdAndRemove(_id);
      res.status(200).send("tweet has been deleted");
    } catch (ex) {
      res.status(404).send("Could not find the tweet in the Database");
    }
  }
);

//get all Tweets
router.get("/allTweets/:postedBy", async (req, res) => {
  //
  let { following } = await User.findById(req.params.postedBy).select(
    "following"
  );
  const { postedBy } = req.params;
  following.push(req.params.postedBy);
  try {
    const Tweets = await Tweets.find({ postedBy: { $in: following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created");
    res.status(200).send(Tweets);
  } catch (error) {
    res.status(400).send("Unexpected error occured");
  }
});

//fetch all users
router.get("/usertofollow/:userid", [validateObjId], async (req, res) => {
  const { following } = await User.findById(req.params.userid).select(
    "following"
  );

  const user = await User.find({ _id: { $nin: following } }).select("name");
  if (user.length === 0) return res.status(200).send("No User found");
  res.status(200).send(user);
});

// add following --middleware [auth, validateObjId]
router.put("/addfollowing/:userid", async (req, res) => {
  const userid = req.params.userid;
  const myid = req.body._id;
  const { following } = await User.findById(myid).select("following");
  const findfollowing = following.filter((u) => u == userid);
  if (findfollowing.length > 0)
    return res.status(404).send("You are following the User already!");
  if (userid === myid)
    return res.status(404).send("You can't add yourself as following!");
  //finding the following user id exists
  const fUser = await User.findByIdAndUpdate(
    userid,
    { $push: { followers: myid } },
    { new: true }
  );
  if (!fUser)
    return res.status(404).send("User you wish to follow is not found!");
  //finding the user with id if exists
  const user = await User.findByIdAndUpdate(
    myid,
    { $push: { following: userid } },
    { new: true }
  );

  if (!user) return res.status(404).send("User not found!");

  res.status(200).send([user]);
});

//remove following
router.put(
  "/removefollowing/:userid",
  [auth, validateObjId],
  async (req, res) => {
    const userid = req.params.userid;
    const myid = req.body._id;

    try {
      const { following } = await User.findById(myid).select("following");
      if (!following)
        return res.status(200).send("can't find the user in the databse!");
      const findfollowing = following.filter((u) => u == userid);
      if (findfollowing.length === 0)
        return res.status(404).send("You are not following the User already!");
      if (userid === myid)
        return res.status(404).send("You can't remove yourself as unfollow!");
      //finding the following user id exists
      const fUser = await User.findByIdAndUpdate(
        userid,
        { $pull: { followers: myid } },
        { new: true }
      );
      if (!fUser)
        return res.status(404).send("User you wish to unfollow is not found!");
      //finding the user with id if exists
      const user = await User.findByIdAndUpdate(
        myid,
        { $pull: { following: userid } },
        { new: true }
      );

      if (!user) return res.status(404).send("User not found!");

      res.status(200).send("You are not following the user anymore!");
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

module.exports = router;
