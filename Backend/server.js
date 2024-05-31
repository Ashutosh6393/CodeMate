import http from "http";
import express from "express";
import { Server } from "socket.io";
import { EVENTS } from "./events.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const getRoomMembers = async (roomId) => {
  let members = [];
  io.in(roomId)
    .fetchSockets()
    .then((data) => {
      members = data.map((item) => {
        return { socketId: item.id, username: item.data.username };
      });

      io.to(roomId).emit(EVENTS.ROOM_MEMBERS, members);
    });
};

io.on("connection", (socket) => {
  socket.on(EVENTS.JOIN, async ({ roomId, username }) => {
    socket.data.username = username;
    socket.data.roomId = roomId;
    socket.join(roomId);
    getRoomMembers(roomId);
    io.to(roomId).emit(EVENTS.NEW_MEMBER, { username, socketId: socket.id });
  });

  socket.on(EVENTS.JOIN_CODESPACE, (data) => {
    console.log("currently watching : ", data.userToWatch);
    socket.join(data.userToWatch);
    // socket.to(userToWatch).emit(EVENTS.GET_CODE, socket.id)
  });

  socket.on(EVENTS.LEAVE_CODESPACE, (socketId) => {
    socket.leave(socketId);
  });

  socket.on("disconnect", () => {
    io.to(socket.data.roomId).emit(
      EVENTS.LEAVE,
      { username: socket.data.username, socketId: socket.id },
      () => {
        getRoomMembers(socket.data.roomId);
        socket.leave(socket.data.roomId);
      }
    );
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// socket.on(EVENTS.CODE_CHANGE, (data) => {
//   io.to(socket.id).emit(EVENTS.SEND_CODE, data);
//   // console.log(data);
// });
