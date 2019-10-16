import React, { Component } from "react";

class Chat extends Component {
  state = {};

  sendMsg = event => {
    event.preventDefault();
    this.props.send(this.refs.message.value);
    this.refs.message.value = "";
  };

  render() {
    const { messages } = this.props;

    return (
      <>
        <div className="chat-box">
          {messages.map(msg => (
            <>
              <div className="chat-name">{msg["sender"] + ": "}</div>
              <div>{msg["msg"]}</div>
            </>
          ))}
        </div>

        <form onSubmit={this.sendMsg}>
          <input className="chat-input" text="" ref="message" />
        </form>
      </>
    );
  }
}

export default Chat;
