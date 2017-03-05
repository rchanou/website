import React from "react";
import { autorun, observe, toJS } from "mobx";
import { Observer } from "mobx-react";

import loadSokobanMap from "../models";
import { groupTypes } from "../constants";

const exampleLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x * bx ",
  " x   tx ",
  " xxxxxx "
];

const levelStore = loadSokobanMap(exampleLevelMap);

const colorMap = {
  [groupTypes.player]: "orange",
  [groupTypes.box]: "beige",
  [groupTypes.wall]: "gray",
  [groupTypes.target]: "aquamarine"
};

class Sokoban extends React.Component {
  static defaultProps = { store: levelStore, scale: 40 };

  constructor(props) {
    super(props);
    const { store } = this.props;
    this.handleLeft = store.tryMove.bind(store, "x", -1);
    this.handleDown = store.tryMove.bind(store, "y", +1);
    this.handleUp = store.tryMove.bind(store, "y", -1);
    this.handleRight = store.tryMove.bind(store, "x", +1);
  }

  render() {
    const { store, scale } = this.props;
    return (
      <div>
        <Observer>
          {() => (
            <div
              style={{
                position: "relative",
                height: 8 * scale,
                width: 8 * scale,
                background: "#eee"
              }}
            >
              {store.entities.map((ent, i) => {
                const baseStyle = {
                  position: "absolute",
                  width: scale,
                  height: scale,
                  background: "gray",
                  opacity: 0.8,
                  transform: (
                    `translateX(${ent.position.x *
                      scale}px) translateY(${ent.position.y * scale}px)`
                  )
                };

                let finalStyle = baseStyle;

                if (ent.group === groupTypes.player) {
                  finalStyle = {
                    ...baseStyle,
                    background: "orange",
                    borderRadius: "50%"
                  };
                }

                if (ent.group === groupTypes.target) {
                  finalStyle = {
                    ...baseStyle,
                    background: "tomato",
                    borderRadius: "50%",
                    transformOrigin: "50% 50%",
                    transform: (
                      `translateX(${ent.position.x *
                        scale}px) translateY(${ent.position.y *
                        scale}px) scale(0.5)`
                    )
                  };
                }

                if (ent.group === groupTypes.box) {
                  finalStyle = { ...baseStyle, background: "brown" };
                }

                return <div key={ent.id} style={finalStyle} />;
              })}

            </div>
          )}
        </Observer>
        {store.player.position.x},{store.player.position.y}
        <button onClick={this.handleLeft}>Left</button>
        <button onClick={this.handleDown}>Down</button>
        <button onClick={this.handleUp}>Up</button>
        <button onClick={this.handleRight}>Right</button>
      </div>
    );
  }
}


export default Sokoban;
