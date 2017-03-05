const { observable, toJS, createTransformer } = require("mobx");

class Entity {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

class Player extends Entity {}
class Target extends Entity {}
class Box extends Entity {}
class Wall extends Entity {}

class Level {
  constructor(entities) {
    this.entities = entities;
  }
}

class LevelStore {
  constructor(entities) {
    this.store = observable({
      entities,
      get player() {
        for (const entity of entities) {
          if (entity instanceof Player) {
            return entity;
          }
        }
      },
      get positionMap() {
        const positionMap = {};
        for (const entity of entities) {
          const entityY = entity.y;
          if (!positionMap[entityY]) {
            positionMap[entityY] = {};
          }
          positionMap[entityY][entity.x] = true;
        }
        //console.log(positionMap);
        return positionMap;
      },
      get canMoveRight() {
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
      }
    });

    this.actions = {
      movePlayer(axis, dir) {
      }
    };
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

const exampleLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x b  x ",
  " x   tx ",
  " xxxxxx "
];

const test = loadLevelMap(exampleLevelMap);
console.log(toJS(test.store.positionMap));
