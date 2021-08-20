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
io.on("connection", (socket) => {
  console.log("new Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// // Run when client connects
// io.on("connection", (socket) => {
//   socket.on("joinRoom", ({ username, room }) => {
//     const user = userJoin(socket.id, username, room);

//     socket.join(user.room);

//     // Broadcast when a user connects
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         "message",
//         formatMessage(botName, `${user.username} has joined the chat`)
//       );

//     // Send users and room info
//     io.to(user.room).emit("roomUsers", {
//       room: user.room,
//       users: getRoomUsers(user.room),
//     });
//   });

//   // Listen for chatMessage
//   socket.on("chatMessage", (msg) => {
//     // const user = getCurrentUser(socket.id);
//     const user = { username: "Gagandeep", room: "room1" };
//     io.to(user.room).emit("message", formatMessage(user.username, msg));
//   });

//   // Runs when client disconnects
//   socket.on("disconnect", () => {
//     const user = userLeave(socket.id);

//     if (user) {
//       io.to(user.room).emit(
//         "message",
//         formatMessage(botName, `${user.username} has left the chat`)
//       );

//       // Send users and room info
//       io.to(user.room).emit("roomUsers", {
//         room: user.room,
//         users: getRoomUsers(user.room),
//       });
//     }
//   });
//});

module.exports = server;
