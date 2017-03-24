export const physicalTypes = Object.freeze({
  pushable: "PUSHABLE",
  obstacle: "OBSTACLE"
});

export const groupTypes = Object.freeze({
  player: "PLAYER",
  target: "TARGET",
  box: "BOX",
  wall: "WALL"
});

export const entitySchemas = Object.freeze({
  player: {
    isPlayer: true,
    group: groupTypes.player,
    physicalType: physicalTypes.obstacle
  },
  target: { group: groupTypes.target },
  box: {
    group: groupTypes.box,
    physicalType: physicalTypes.pushable
  },
  wall: {
    group: groupTypes.wall,
    physicalType: physicalTypes.obstacle
  }
});
