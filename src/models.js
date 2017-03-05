import { computed, createTransformer, observable, toJS } from "mobx";
import { groupTypes, physicalTypes, entitySchemas } from "./constants";

class LevelStore {
  constructor(entities) {
    this.entities = observable(entities);

    this.actions = {
      movePlayer(axis, dir) {
      }
    };
  }

  get entityList() {
    return this.entities.slice();
  }

  get player() {
    for (const entity of this.entities) {
      if (entity.isPlayer) {
        return entity;
      }
    }
  }

  tryMove(axis, step) {
    //console.log("move", axis, step);
    const player = this.player.position;
    const positionToTry = {
      ...player,
      [axis]: player[axis] + step
    };

    const entities = this.entities;
    const entityThere = entities.find(
      ent =>
        ent.physicalType &&
          ent.position.x === positionToTry.x &&
          ent.position.y === positionToTry.y
    );
    if (entityThere) {
      if (entityThere.physicalType === physicalTypes.obstacle) {
        return;
      }

      if (entityThere.physicalType === physicalTypes.pushable) {
        const nextPositionOver = {
          ...player,
          [axis]: player[axis] + step * 2
        };
        const nextEntityOver = entities.find(
          ent =>
            ent.position.x === nextPositionOver.x &&
              ent.position.y === nextPositionOver.y
        );

        if (nextEntityOver && nextEntityOver.physicalType) {
          return;
        }
        //console.log("st");
        entityThere.position[axis] += step;
      }
    }
    this.player.position[axis] += step;
  }
}

const loadSokobanMap = levelMap => {
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
    console.table(entities);
  });
  return new LevelStore(entities);
};

export default loadSokobanMap;
