import React, { Component } from "react";

import blocktopus from "./images/blocktopus.png";
import pink from "./images/pink.png";
import panda from "./images/panda.png";
import slime from "./images/slime.png";
import trixter from "./images/trixter.png";
import pig from "./images/pig.png";
import mushroom from "./images/mushroom.png";
import octopus from "./images/octopus.png";

import pandablocktopus from "./images/panda-blocktopus.png";
import pandapink from "./images/panda-pink.png";
import pandatrixter from "./images/panda-trixter.png";
import pigmushroom from "./images/pig-mushroom.png";
import pigoctopus from "./images/pig-octopus.png";
import pinktrixter from "./images/pink-trixter.png";
import slimemushroom from "./images/slime-mushroom.png";
import slimeoctopus from "./images/slime-octopus.png";
import slimepig from "./images/slime-pig.png";

class Choices extends Component {
  state = {
    boards: [
      pandablocktopus,
      pandapink,
      pandatrixter,
      pigmushroom,
      pigoctopus,
      pinktrixter,
      slimemushroom,
      slimeoctopus,
      slimepig
    ],
    pieces: [
      [panda, blocktopus],
      [panda, pink],
      [panda, trixter],
      [pig, mushroom],
      [pig, octopus],
      [pink, trixter],
      [slime, mushroom],
      [slime, octopus],
      [slime, pig]
    ]
  };

  render() {
    const { click, selected } = this.props;

    return (
      <div className="choices">
        <div>
          {/* {players[0] === "" ? (
            <div className="chooseHeader">
              Choose Player1 Piece
              <br />
            </div>
          ) : (
            <div className="chooseHeader">
              Choose Player2 Piece
              <br />
            </div>
          )} */}
          {this.state.boards.map((board, index) => (
            <button
              key={board}
              className="piece-button"
              onClick={() => {
                selected();
                click(this.state.pieces[index]);
              }}
            >
              <img src={board} />
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default Choices;
