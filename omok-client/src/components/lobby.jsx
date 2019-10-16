import React, { Component } from "react";

import JoinGame from "./joinGame";
import NewGame from "./newGame";
import Choices from "./choices";

class Lobby extends Component {
  state = {
    pickIcon: false,
    newGame: false,
    joinGame: false
  };

  returnToLobby = () => {
    this.setState({ newGame: false, joinGame: false });
  };

  handleSelectPiece = () => {
    this.setState({ pickIcon: true });
  };

  render() {
    const { name, join, id, handlePieceClick } = this.props;
    return (
      <div className="lobby">
        Hi {name}!<br />
        <div>
          {!this.state.newGame && !this.state.joinGame ? (
            <div>
              <button
                onClick={() => {
                  // create();
                  this.setState({ newGame: true });
                }}
              >
                Start Game
              </button>
              <button
                onClick={() => {
                  this.setState({ joinGame: true });
                }}
              >
                Join Game
              </button>
            </div>
          ) : null}
        </div>
        {this.state.newGame ? (
          <div>
            {!this.state.pickIcon ? (
              <>
                <span>Pick a board to play with</span>
                <Choices
                  selected={this.handleSelectPiece}
                  click={handlePieceClick}
                />
              </>
            ) : (
              <NewGame cancel={this.returnToLobby} id={id} />
            )}
          </div>
        ) : null}
        {this.state.joinGame ? (
          <JoinGame cancel={this.returnToLobby} join={join} />
        ) : null}
      </div>
    );
  }
}

export default Lobby;
