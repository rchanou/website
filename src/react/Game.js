import React from "react";

import loadLevelMap from "../models";

const exampleLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x b bx ",
  " x   bx ",
  " xxxxxx "
];

const levelStore = loadLevelMap(exampleLevelMap);

const colorMap = {
  Player: "orange",
  Box: "beige",
  Wall: "gray",
  Target: "aquamarine"
};

const Sokoban = ({ store = levelStore, scale = 40 }) => {
  return (
    <div
      style={{
        position: "relative",
        height: 5 * scale,
        width: 6 * scale,
        background: "steelblue"
      }}
    >
      {store.entities.map((ent, i) => {
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              background: colorMap[ent.constructor.name],
              width: scale,
              height: scale,
              transform: (
                `translateX(${ent.x * scale}px) translateY(${ent.y * scale}px)`
              )
            }}
          />
        );
      })}
    </div>
  );
};

export default Sokoban;
