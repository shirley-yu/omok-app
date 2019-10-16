// Updated. Thanks to: Paul Luna
import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import generatePassword from "password-generator";

import Login from "./components/login";
import Lobby from "./components/lobby";
import Board from "./components/board";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      roomid: "",
      gameFound: false,
      msg: "",
      socket: null
    };
    this.initSocket();
  }

  initSocket = () => {
    // if (!this.state.socket) {
    //   const socket = socketIOClient(this.state.endpoint);
    //   this.setState({ socket });
    // }
    // var endpoint = "localhost:4001";
    var endpoint = "omok-app.herokuapp.com";
    const socket = socketIOClient(endpoint);
    this.state.socket = socket;
  };

  componentDidMount = () => {
    // if (this.state.socket) {
    //   setInterval(this.checkUpdates(), 1000);
    // } else {
    //   this.initSocket();
    // }
    if (this.state.socket) {
      setInterval(this.checkUpdates(), 1000);
    }
  };

  checkUpdates = () => {
    const socket = this.state.socket;

    socket.on("hi", () => {
      this.setState({ msg: "hi" });
    });

    socket.on("update playerlist", data => {
      const players = data["players"];
      const pieces = data["pieces"];
      this.setState({ players, pieces });
    });

    socket.on("initiate game", () => {
      var squares = new Array(15);
      for (var i = 0; i < squares.length; i++) {
        squares[i] = new Array(15).fill("");
      }
      this.setState({
        gameFound: true,
        squares,
        gameOver: false,
        messages: []
      });
    });

    socket.on("update board", board => {
      const last_move = board["last_move"];
      console.log(last_move);
      var element = document.getElementsByClassName("lastMove");
      for (var i = 0; i < element.length; i++) {
        var ele = element[i];
        ele.classList.remove("lastMove");
      }
      var id = "row" + last_move[0] + "col" + last_move[1];
      element = document.getElementById(id);
      element.classList.add("lastMove");
      this.setState({
        squares: board["squares"],
        game_turn: board["game_turn"]
      });
    });

    socket.on("update winner", data => {
      this.test();

      this.setState({
        gameOver: true,
        winner: data["winner"],
        squares: data["squares"]
      });
    });

    socket.on("update messages", data => {
      var messages = this.state.messages;
      const msg = data["msg"];
      const sender = data["sender"];
      messages.push({ sender, msg });
      this.setState({ messages });
    });

    socket.on("init play again", turn => {
      var squares = new Array(15);
      for (var i = 0; i < squares.length; i++) {
        squares[i] = new Array(15).fill("");
      }
      var element = document.getElementsByClassName("square");
      for (i = 0; i < element.length; i++) {
        var ele = element[i];
        ele.classList.remove("mystyle");
      }
      this.setState({ squares, gameOver: false, game_turn: turn });
    });

    socket.on("reset room", () => {
      this.setState({
        gameFound: false,
        game_turn: null,
        pieces: null,
        squares: null,
        players: null,
        roomid: null,
        gameOver: null,
        player_turn: null,
        winner: null,
        messages: []
      });
    });
  };

  playAgain = () => {
    var start_turn = 0;
    const winner = this.state.winner;
    if (winner === 0) {
      start_turn = 1;
    } else start_turn = 0;
    var data = { roomid: this.state.roomid, game_turn: start_turn };
    const socket = this.state.socket;
    socket.emit("play again", data);
  };

  leaveRoom = () => {
    const socket = this.state.socket;
    const roomid = this.state.roomid;
    socket.emit("leave room", roomid);
  };

  handleNewUser = name => {
    this.setState({ name });
    const socket = this.state.socket;
    socket.emit("set name", name);
  };

  newRoom = () => {
    const socket = this.state.socket;
    const roomid = generatePassword(12, false);
    const data = { roomid: roomid, pieces: this.state.pieces };
    socket.emit("create room", data);
    this.setState({
      roomid,
      player_turn: 0,
      game_turn: 0
    });
  };

  joinRoom = roomid => {
    const socket = this.state.socket;
    socket.emit("join room", roomid);
    this.setState({ roomid, player_turn: 1, game_turn: 0 });
  };

  checkWin = ([i, j], turn) => {
    const board = this.state.squares;
    // check same column
    var count = 0;
    var flag = false;
    for (var x = i - 5; x < i + 5; x++) {
      if (x < 0 || x > 14) {
        continue;
      } else {
        if (board[x][j] === turn) {
          count += 1;
          if (count === 5) break;
        } else {
          count = 0;
        }
      }
    }
    if (count === 5) flag = true;
    // check same row
    if (!flag) {
      count = 0;
      for (x = j - 5; x < j + 5; x++) {
        if (x < 0 || x > 14) {
          continue;
        } else {
          if (board[i][x] === turn) {
            count += 1;
            if (count === 5) break;
          } else {
            count = 0;
          }
        }
      }
      if (count === 5) flag = true;
    }
    // check along diagnal
    if (!flag) {
      count = 0;
      for (var x = i - 5, y = j - 5; x < i + 5, y < j + 5; x++, y++) {
        if (x < 0 || x > 14 || y < 0 || y > 14) {
          continue;
        } else {
          if (board[x][y] === turn) {
            count += 1;
            if (count === 5) break;
          } else {
            count = 0;
          }
        }
      }
      if (count === 5) flag = true;
    }

    if (flag === true) {
      var gameOver = true;
      var winner = turn;
      this.setState({ gameOver, winner }, () => {
        const socket = this.state.socket;
        socket.emit("game over", {
          squares: this.state.squares,
          winner: winner,
          roomid: this.state.roomid
        });
      });
    }
  };

  test() {
    var element = document.getElementsByClassName("square");
    for (var i = 0; i < element.length; i++) {
      var ele = element[i];
      ele.classList.add("mystyle");
    }
  }

  handleBoardClick = ([i, j]) => {
    var squares = this.state.squares.slice();
    var game_turn = this.state.game_turn;
    var player_turn = this.state.player_turn;
    var gameOver = this.state.gameOver;
    if (!gameOver) {
      if (squares[i][j] === "") {
        if (game_turn === player_turn) {
          squares[i][j] = player_turn;
          this.setState({ squares, game_turn: -1 }, () => {
            this.checkWin([i, j], player_turn);
            var game_turn = 2;
            if (player_turn === 0) {
              game_turn = 1;
            } else game_turn = 0;
            const socket = this.state.socket;
            socket.emit("next turn", {
              squares: squares,
              game_turn: game_turn,
              roomid: this.state.roomid,
              lastMove: [i, j]
            });
          });
        }
      }
    }
  };

  handlePieceClick = pieces => {
    this.setState({ pieces }, () => {
      this.newRoom();
    });
  };

  handleSendMessage = msg => {
    const socket = this.state.socket;
    const data = {
      roomid: this.state.roomid,
      msg: msg,
      sender: this.state.name
    };
    socket.emit("send message", data);
  };

  render() {
    return (
      <div>
        {this.state.name === "" ? <Login submit={this.handleNewUser} /> : null}
        {this.state.name !== "" && !this.state.gameFound ? (
          <Lobby
            name={this.state.name}
            join={this.joinRoom}
            create={this.newRoom}
            id={this.state.roomid}
            handlePieceClick={this.handlePieceClick}
          />
        ) : null}
        {this.state.gameFound && this.state.players ? (
          <Board
            name={this.state.name}
            pieces={this.state.pieces}
            squares={this.state.squares}
            handleClick={this.handleBoardClick}
            turn={this.state.game_turn}
            players={this.state.players}
            winner={this.state.winner}
            gameOver={this.state.gameOver}
            again={this.playAgain}
            leave={this.leaveRoom}
            send={this.handleSendMessage}
            messages={this.state.messages}
          />
        ) : null}
      </div>
    );
  }
}
export default App;
