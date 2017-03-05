import React from "react";
import { autorun } from "mobx";
import { Observer } from "mobx-react";

import loadSokobanMap from "../models";

const exampleLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x b bx ",
  " x   bx ",
  " xxxxxx "
];

const levelStore = loadSokobanMap(exampleLevelMap);

const colorMap = {
  Player: "orange",
  Box: "beige",
  Wall: "gray",
  Target: "aquamarine"
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
                height: 5 * scale,
                width: 6 * scale,
                background: "steelblue"
              }}
            >
              {store.entities.slice().map((ent, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      background: colorMap[ent.constructor.name],
                      width: scale,
                      height: scale,
                      transform: (
                        `translateX(${ent.position.x *
                          scale}px) translateY(${ent.position.y * scale}px)`
                      )
                    }}
                  />
                );
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

autorun(() => {
  console.table(
    levelStore.entities.slice().map(ent => ({
      type: ent.constructor.name,
      pos: `${ent.position.x},${ent.position.y}`,
      block: ent.blockType
    }))
  );
});

autorun(() => {
  console.log(levelStore.player);
});
console.log(levelStore.entities[7])

export default Sokoban;
