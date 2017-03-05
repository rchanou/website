import { computed, createTransformer, observable, toJS } from 'mobx'

import { Player, Box, Wall, Target } from './classes';

const createDirectionCheck = (axis, dir) => {
  return computed(() => {
    const playerX = this.player.x;
    const playerY = this.player.y;
    const rightEntity = this.positionMap[playerY][playerX + 1];
    if (rightEntity instanceof Wall) {
      return false;
    } else if (rightEntity instanceof Box) {
      const righterEntity = this.positionMap[playerY][playerX + 2];
      if (righterEntity instanceof Wall || righterEntity instanceof Box) {
        return false;
      } else {
        return true;
      }
    }
  });
};

class LevelStore {
  constructor(entities) {
    this.entities = observable(entities);

    const createDirectionCheck = (axis, dir = 1) => {
      return computed(() => {
        const moveOnY = axis === "y";
        const nearEntity = this.positionMap[playerY + (moveOnY ? dir : 0)][
          playerX + (moveOnY ? 0 : dir)
        ];
        if (nearEntity instanceof Wall) {
          return false;
        } else if (nearEntity instanceof Box) {
          const nextEntityOver = this.positionMap[
            playerY + (moveOnY ? dir * 2 : 0)
          ][playerX + (moveOnY ? 0 : dir * 2)];
          if (nextEntityOver instanceof Wall || nextEntityOver instanceof Box) {
            return false;
          } else {
            return true;
          }
        }
      });
    };

    this.actions = {
      movePlayer(axis, dir) {
      }
    };
  }

  get player() {
    for (const entity of this.entities) {
      if (entity instanceof Player) {
        return entity;
      }
    }
  }

  tryMove(axis, step) {
    const player = this.player;
    const positionToTry = Object.assign({}, player, {
      [axis]: player[axis] + step
    });

    const entities = this.entities;
    const entityThere = entities.find(
      ent => ent.x === positionToTry.x && ent.y === positionToTry.y
    );
    if (entityThere) {
      if (entityThere instanceof Wall) {
        return;
      }
      if (entityThere instanceof Box) {
        const nextPositionOver = Object.assign({}, player, {
          [axis]: player[axis] + step * 2
        });
        const nextEntityOver = entities.find(
          ent => ent.x === nextPositionOver.x && ent.y === nextPositionOver.y
        );
        if (nextEntityOver instanceof Wall || nextEntityOver instanceof Box) {
          return;
        }
      }
    }
    this.player[axis] += step;
  }
}

const loadLevelMap = levelMap => {
  let entities = [];
  levelMap.forEach((row, y) => {
    for (let x in row) {
      x = Number(x);
      switch (row[x]) {
        case " ":
          break;
        case "p":
          entities.push(new Player({ x, y }));
          break;
        case "t":
          entities.push(new Target({ x, y }));
          break;
        case "b":
          entities.push(new Box({ x, y }));
          break;
        case "x":
          entities.push(new Wall({ x, y }));
          break;
        case "*":
          entities.push(new Target({ x, y }));
          entities.push(new Box({ x, y }));
          break;
        case "@":
          entities.push(new Player({ x, y }));
          entities.push(new Target({ x, y }));
          break;
      }
    }
  });
  return new LevelStore(entities);
};


export default loadLevelMap;

/*
const test = loadLevelMap(exampleLevelMap);
console.log(toJS(test.player));
test.tryMove("y", 1);
console.log(toJS(test.player));
*/