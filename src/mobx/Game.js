import { observable } from "mobx";

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

const exampleLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x b  x ",
  " x   tx ",
  " xxxxxx "
];

const loadLevelMap = levelMap => {
  let entities = [];
  for (const y in levelMap) {
    const row = levelMap[y];
    for (const x in row) {
      switch (row[x]) {
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
  }
  return new Level(entities);
};
