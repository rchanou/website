import React from "react";
import styled from "styled-components";
import { createTransformer } from "mobx";
import { sortBy } from "lodash";

import { getLevelPlayStore } from "./stores";
import { entitySchemas, groupTypes } from "./constants";

export const hasWon = createTransformer(entities => {
  const targets = entities.filter(ent => ent.group === groupTypes.target);
  const boxes = entities.filter(ent => ent.group === groupTypes.box);
  for (const target of targets) {
    const targetPos = target.position;
    if (
      !boxes.find(
        box => box.position.x === targetPos.x && box.position.y === targetPos.y
      )
    ) {
      return false;
    }
  }
  return true;
});

export const getNextKeyInDir = (positions, currentPosKey, axis, dir) => {
  const crossAxis = axis === "x" ? "y" : "x";
  const sortedPositions = sortBy(positions, [crossAxis, axis]);
  const currentPosIndex = sortedPositions.findIndex(
    p => p.key === currentPosKey
  );
  let nextPosIndex = currentPosIndex + dir;
  if (nextPosIndex < 0) {
    nextPosIndex = positions.length - 1;
  } else if (nextPosIndex > positions.length - 1) {
    nextPosIndex = 0;
  }
  return sortedPositions[nextPosIndex].key;
};

const getMax = (axis, entities) =>
  Math.max.apply(null, entities.map(ent => ent.position[axis])) + 1;

const Sprite = styled.div`
  position: absolute;
  opacity: 0.8;
  transition: 0.2s;
  background: gray;
  pointerEvents: none;
`;

export const getEntityRenderer = (entities, units, hash) => {
  units = units || Math.max(getMax("x", entities), getMax("y", entities));
  const unit = 100 / units;

  return ent => {
    const startStyle = {
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
      if (
        entities.find(
          otherEnt =>
            otherEnt.group === groupTypes.target &&
              otherEnt.position.x === ent.position.x &&
              otherEnt.position.y === ent.position.y
        )
      ) {
        finalStyle = { ...startStyle, background: "darkorchid" };
      } else {
        finalStyle = { ...startStyle, background: "brown" };
      }
    }

    return <Sprite key={ent.id} style={finalStyle} />;
  };
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
        default:
      }
    }
    //console.table(entities);
  });
  return getLevelPlayStore({ initialLevelState: entities, moves: [] });
  //return new LevelStore(entities);
};
