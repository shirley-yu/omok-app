import React, { Component } from "react";

class Square extends Component {
  render() {
    const { pieces, square, handleClick, index } = this.props;
    return (
      <button
        id={"row" + index[0] + "col" + index[1]}
        className="square"
        onClick={() => handleClick(index)}
      >
        {square !== "" ? (
          <>
            {square === 0 ? <img src={pieces[0]} /> : <img src={pieces[1]} />}
          </>
        ) : null}
      </button>
    );
  }
}
export default Square;
