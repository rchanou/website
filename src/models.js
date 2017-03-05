import { computed, createTransformer, observable, toJS } from "mobx";

import { Player, Box, Wall, Target, Entity } from "./classes";

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
      if (entity instanceof Player) {
        return entity;
      }
    }
  }

  tryMove(axis, step) {
    console.log("move", axis, step);
    const player = this.player.position;
    const positionToTry = {
      ...player,
      [axis]: player[axis] + step
    };

    const entities = this.entities;
    const entityThere = entities.find(
      ent =>
        ent.position.x === positionToTry.x && ent.position.y === positionToTry.y
    );
    if (entityThere) {
      if (entityThere.isObstacle) {
        return;
      }

      if (entityThere.isPushable) {
        const nextPositionOver = {
          ...player,
          [axis]: player[axis] + step * 2
        };
        const nextEntityOver = entities.find(
          ent =>
            ent.position.x === nextPositionOver.x &&
              ent.position.y === nextPositionOver.y
        );

        if (nextEntityOver && nextEntityOver.isPhysical) {
          return;
        }

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
          break;
        case "p":
          entities.push(new Player({ position }));
          break;
        case "t":
          entities.push(new Target({ position }));
          break;
        case "b":
          entities.push(new Box({ position }));
          break;
        case "x":
          entities.push(new Wall({ position }));
          break;
        case "*":
          entities.push(new Target({ position }));
          entities.push(new Box({ position }));
          break;
        case "@":
          entities.push(new Player({ position }));
          entities.push(new Target({ position }));
          break;
      }
    }
  });
  return new LevelStore(entities);
};

export default loadSokobanMap;
