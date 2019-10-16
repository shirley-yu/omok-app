import React, { Component } from "react";
import Square from "./square";
import Chat from "./chat";

class Board extends Component {
  state = {};
  render() {
    const {
      name,
      handleClick,
      turn,
      squares,
      pieces,
      players,
      winner,
      gameOver,
      again,
      leave,
      send,
      messages
    } = this.props;

    return (
      <div className="board-container">
        <div className="board">
          <div className="name">{name}</div>
          {squares.map((row, i) => (
            <div className="board-row">
              {row.map((square, j) => (
                <Square
                  pieces={pieces}
                  square={square}
                  handleClick={handleClick}
                  index={[i, j]}
                />
              ))}
            </div>
          ))}
          <div>
            {!gameOver ? (
              <>
                <img src={pieces[turn]} /> {players[turn] + "'s turn ..."}
              </>
            ) : (
              <>
                <img src={pieces[winner]} /> {players[winner] + " Won!"}
                <button onClick={() => again()}>Play Again?</button>
                <button onClick={() => leave()}>Leave Game Room</button>
              </>
            )}
          </div>
        </div>
        <div className="chat-container">
          <Chat send={send} messages={messages} />
        </div>
      </div>
    );
  }
}

export default Board;
