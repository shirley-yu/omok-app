import React, { Component } from "react";

class NewGame extends Component {
  state = {};

  render() {
    const { cancel, id } = this.props;
    return (
      <div>
        Invite a friend by sending them this room id:
        <br />
        <span>{id}</span>
        <br />
        <br />
        <button onClick={() => cancel()}>Cancel</button>
      </div>
    );
  }
}

export default NewGame;
