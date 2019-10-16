import React, { Component } from "react";

class JoinGame extends Component {
  state = {};

  joinGame = event => {
    event.preventDefault();
    this.props.join(this.refs.id.value);
    this.refs.id.value = "";
  };

  render() {
    const { cancel } = this.props;

    return (
      <div>
        {" "}
        <br />
        Enter id here
        <form onSubmit={this.joinGame}>
          <input type="text" ref="id"></input>
        </form>
        <button onClick={() => cancel()}>Cancel</button>
      </div>
    );
  }
}

export default JoinGame;
