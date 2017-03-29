import React from "react";
import styled, { keyframes } from "styled-components";
import { createTransformer } from "mobx";
import { find, sortBy } from "lodash";
import update from "immutability-helper";

import { getLevelPlayStore } from "../stores";
import { entitySchemas, groupTypes } from "../constants";

export const hasWon = createTransformer(entities => {
  const targets = entities.filter(ent => ent.group === groupTypes.target);
  const boxes = entities.filter(ent => ent.group === groupTypes.box);
  for (const target of targets) {
    const targetPos = target.position;
    if (!find(boxes, { position: targetPos })) {
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

export const getMin = (axis, entities) =>
  Math.min.apply(null, entities.map(ent => ent.position[axis]));

export const getMax = (axis, entities) =>
  Math.max.apply(null, entities.map(ent => ent.position[axis]));

const glowAnimation = keyframes`
  from {
    stroke-opacity: 1;
    fill-opacity: 1;
    rotate(0deg);
  }
  }
  50% {
    stroke-opacity: 0.5;
    fill-opacity: 0.5;
    rotate(180deg);
  }
  to {
    stroke-opacity: 1;
    fill-opacity: 1;
    rotate(360deg);
  }
`;

const SpriteBox = styled.div`
  position: absolute;
  opacity: 0.8;
  transition: 0.2s;
  background: gray;
  pointer-events: none;

  animation: ${glowAnimation};
  animation-duration: 1.2s;
  animation-iteration-count: infinite;
  
`;

// TODO: finish, use to replace SpriteBox + inline styles
const Sprite = styled.div`
  position: absolute;
  opacity: 0.8;
  transition: 0.2s;
  width: ${props => props.unit}%;
  height: ${props => props.unit}%;
  top: ${props => props.entity.position.y * props.unit}%;
  left: ${props => props.entity.position.x * props.unit}%;
  background: ${props => {
  switch (props.entity.group) {
    case groupTypes.player:
      return "orange";
    case groupTypes.target:
      return "tomato";
    case groupTypes.box:
      const { entities, entity } = props;
      if (entities.find(otherEnt => otherEnt.group === groupTypes.target && otherEnt.position.x === entity.position.x && otherEnt.position.y === entity.position.y)) {
        return "darkorchid";
      }
      break;
    default:
      return "gray";
  }
}}
`;

export const getEntityRenderer = (entities, units, hash) => {
  units = units ||
    Math.max(getMax("x", entities) + 1, getMax("y", entities) + 1);
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

    const otherProps = {};
    if (ent.group === groupTypes.box) {
      if (
        find(entities, { group: groupTypes.target, position: ent.position })
      ) {
        finalStyle = { ...startStyle, background: "darkorchid" };
        otherProps.className = "animated";
      } else {
        finalStyle = { ...startStyle, background: "brown" };
      }
    }

    return <SpriteBox key={ent.id} style={finalStyle} {...otherProps} />;
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
  });

  return getLevelPlayStore({ initialLevelState: entities, moves: [] });
};

export const compactPuzzle = puzzle => {
  const minX = getMin("x", puzzle);
  const minY = getMin("y", puzzle);

  return puzzle.map(ent => {
    const { x, y } = ent.position;
    return update(ent, {
      position: {
        x: { $set: x - minX },
        y: { $set: y - minY }
      }
    });
  });
};
