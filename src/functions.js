import React from "react";
import { sortBy } from "lodash";

import { getLevelPlayStore } from "./stores";
import { entitySchemas, groupTypes } from "./constants";

export const getNextKeyInDir = (positions, currentPosKey, axis, dir) => {
  const crossAxis = axis == "x" ? "y" : "x";
  const sortedPositions = sortBy(positions, [crossAxis, axis]);
  const currentPosIndex = sortedPositions.findIndex(
    p => p.key == currentPosKey
  );
  let nextPosIndex = currentPosIndex + dir;
  if (nextPosIndex < 0) {
    nextPosIndex = positions.length - 1;
  } else if (nextPosIndex > positions.length - 1) {
    nextPosIndex = 0;
  }
  return sortedPositions[nextPosIndex].key;
};

const baseEntityStyle = {
  position: "absolute",
  opacity: 0.8,
  transition: "0.2s",
  background: "gray",
  pointerEvents: "none"
};

const getMax = (axis, entities) =>
  Math.max.apply(null, entities.map(ent => ent.position[axis])) + 1;

export const getEntityRenderer = (entities, units) => ent => {
  units = units || Math.max(getMax("x", entities), getMax("y", entities));
  const unit = 100 / units;

  const startStyle = {
    ...baseEntityStyle,
    width: `${unit}%`,
    height: `${unit}%`,
    top: `${ent.position.y * unit}%`,
    left: `${ent.position.x * unit}%`
  };

  let finalStyle = startStyle;
  if (ent.group === groupTypes.player) {
    finalStyle = {
      ...startStyle,
      background: "orange",
      borderRadius: "50%"
    };
  }
  if (ent.group === groupTypes.target) {
    finalStyle = {
      ...startStyle,
      background: "tomato",
      borderRadius: "50%",
      transformOrigin: "50% 50%",
      transform: "scale(0.5)"
    };
  }
  if (ent.group === groupTypes.box) {
    finalStyle = { ...startStyle, background: "brown" };
  }

  return <div key={ent.id} style={finalStyle} />;
};

export const loadSokobanMap = levelMap => {
  let entities = [];
  levelMap.forEach((row, y) => {
    for (let x in row) {
      x = Number(x);
      const position = { y, x };
      switch (row[x]) {
        case " ":
          continue;
        case "p":
          entities.push({
            ...entitySchemas.player,
            id: entities.length,
            position
          });
          break;
        case "t":
          entities.unshift({
            ...entitySchemas.target,
            id: entities.length,
            position
          });
          break;
        case "b":
          entities.push({
            ...entitySchemas.box,
            id: entities.length,
            position
          });
          break;
        case "x":
          entities.push({
            ...entitySchemas.wall,
            id: entities.length,
            position
          });
          break;
        case "*":
          entities.unshift({
            ...entitySchemas.target,
            id: entities.length,
            position
          });
          entities.push({
            ...entitySchemas.box,
            id: entities.length,
            position
          });
          break;
        case "@":
          entities.unshift({
            ...entitySchemas.target,
            id: entities.length,
            position
          });
          entities.push({
            ...entitySchemas.player,
            id: entities.length,
            position
          });
          break;
      }
    }
    //console.table(entities);
  });
  return getLevelPlayStore({ initialLevelState: entities, moves: [] });
  //return new LevelStore(entities);
};
