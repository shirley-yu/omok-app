import React, { Component } from "react";
class Login extends Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.submit(this.refs.name.value);
    this.refs.name.value = "";
  };

  render() {
    return (
      <div className="container">
        <div className="login">
          <form className="login-form" onSubmit={this.handleSubmit}>
            <label>
              <h1 style={{ textAlign: "center" }}>Enter Name</h1>
            </label>
            <input type="text" ref="name" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
