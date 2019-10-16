const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

// our localhost port
const port = 4001;

const app = express();

// our server instance
const PORT = process.env.PORT || 4001;
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "omok-client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// This is what the socket.io syntax is like, we will work this later
io.on("connection", socket => {
  console.log("New client connected");

  socket.on("set name", name => {
    socket.nickname = name;
  });

  socket.on("create room", data => {
    const roomid = data["roomid"];
    const pieces = data["pieces"];
    socket.join(roomid, () => {
      socket.pieces = pieces;
      console.log(socket.id + " now in rooms ", socket.rooms);
    });
  });

  socket.on("join room", roomid => {
    const room = io.sockets.adapter.rooms[roomid];
    if (room && room.length === 1) {
      socket.join(roomid, () => {
        io.in(roomid).emit("initiate game");
        var clients = io.sockets.adapter.rooms[roomid].sockets;
        var players = [];
        var pieces = [];
        for (var clientId in clients) {
          var clientSocket = io.sockets.connected[clientId];
          players.push(clientSocket.nickname);
          if (clientSocket.pieces) {
            pieces = clientSocket.pieces;
          }
        }
        const data = { players: players, pieces: pieces };
        io.in(roomid).emit("update playerlist", data);
      });
    } else {
      console.log("room is full");
    }
  });

  socket.on("next turn", game => {
    io.in(game["roomid"]).emit("update board", {
      squares: game["squares"],
      game_turn: game["game_turn"],
      last_move: game["lastMove"]
    });
  });

  socket.on("game over", data => {
    io.in(data["roomid"]).emit("update winner", {
      squares: data["squares"],
      winner: data["winner"]
    });
  });

  socket.on("send message", data => {
    const roomid = data["roomid"];
    const msg = data["msg"];
    const sender = data["sender"];
    io.in(roomid).emit("update messages", { msg: msg, sender: sender });
  });

  socket.on("play again", data => {
    const roomid = data["roomid"];
    const game_turn = data["game_turn"];
    io.in(roomid).emit("init play again", game_turn);
  });

  socket.on("leave room", roomid => {
    io.in(roomid).emit("reset room");
    var clients = io.sockets.adapter.rooms[roomid].sockets;
    for (var clientId in clients) {
      var clientSocket = io.sockets.connected[clientId];
      console.log("leaving room");
      clientSocket.leave(roomid);
    }
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
