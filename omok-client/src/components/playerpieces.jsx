import React, { Component } from "react";
class Pieces extends Component {
  render() {
    const { players } = this.props;
    return (
      <div>
        Player1:{" "}
        <button>{players[0] !== "" ? <img src={players[0]} /> : ""}</button>
        Player2:{" "}
        <button>{players[1] !== "" ? <img src={players[1]} /> : ""}</button>
      </div>
    );
  }
}

export default Pieces;
