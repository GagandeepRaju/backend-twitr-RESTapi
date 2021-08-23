const express = require("express");
const app = express();

const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/chatUsers");

// Initialing Server Application
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config.js")();
require("./startup/validation")();

const botName = "ChatCord Bot";

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is runnong on ${port}`);
});
let userName = "";
let userRoom = "";
const io = require("socket.io")(server);
// Run when client connects
io.on("connection", (socket) => {
  console.log("We have a new connection ! ! !");

  socket.on("joinRoom", ({ username, room }) => {
    let user = userJoin(socket.id, username, room);
    userName = username;
    userName = room;
    socket.emit("message", {
      room: room,
      msg: `${user.userName} has joined the room`,
    });

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
    socket.join(user.room);
  });

  // Send users and room info
  //   io.to(user.room).emit("roomUsers", {
  //     room: user.room,
  //     users: getRoomUsers(user.room),
  //   });
  // });

  //listen for login
  socket.on("login", ({ email, password }) => {
    // console.log(email, password);
  });

  // Listen for chatMessage         //callback
  socket.on("sendMessage", ({ message, username, room }) => {
    let user = userJoin(socket.id, username, room);
    userName = username;
    userRoom = room;
    // console.log(getCurrentUser(socket.id));
    user = getCurrentUser(socket.id);
    io.to(room).emit("message", { user: room, text: message });
    socket.join(user.room);
    // callback();
  });

  // Listen for chatMessage         //callback
  socket.on("message", ({ msg, room }) => {
    // console.log(getCurrentUser(socket.id));
    // user = getCurrentUser(socket.id);
    userRoom = room;
    io.to(room).emit("message", { user: room, text: msg });
    socket.join(room);
    // callback();
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    let user = userJoin(socket.id, userName, userRoom);
    console.log(userName);
    user = userLeave(socket.id);
    console.log("User disconnected");
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${userName} has left the chat`)
      );

      // Send users and room info
      io.to(userRoom).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

module.exports = server;
