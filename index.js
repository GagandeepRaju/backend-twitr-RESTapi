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

const io = require("socket.io")(server);
// Run when client connects
io.on("connection", (socket) => {
  console.log("We have a new connection ! ! !");

  socket.on("joinRoom", ({ username, room }) => {
    let user = userJoin(socket.id, username, room);

    socket.emit("message", {
      room: room,
      msg: `${user.username} has joined the room`,
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
  socket.on("sendMessage", (message) => {
    console.log(getCurrentUser(socket.id));
    let user = getCurrentUser(socket.id);
    console.log(user);
    // io.to(user.room).emit("message", { user: user.name, text: message });

    // callback();
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    let user = userLeave(socket.id);
    console.log("User disconnected");
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

module.exports = server;
