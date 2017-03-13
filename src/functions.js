import { getLevelStore } from "./stores";
import { entitySchemas } from "./constants";

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
  return getLevelStore({ initialLevelState: entities, moves: [] });
  //return new LevelStore(entities);
};
