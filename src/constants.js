import ice from "icepick";

export const physicalTypes = ice.freeze({
  pushable: "PUSHABLE",
  obstacle: "OBSTACLE"
});

export const groupTypes = ice.freeze({
  player: "PLAYER",
  target: "TARGET",
  box: "BOX",
  wall: "WALL"
});

export const entitySchemas = ice.freeze({
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
