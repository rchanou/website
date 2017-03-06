import { observable, toJS, autorun } from "mobx";
import { groupTypes, physicalTypes, entitySchemas } from "./constants";
import ice from "icepick";

export const createLevelStore = initialEntities => {
  let entityStateBox = observable.box([initialEntities]);

  const derived = {
    get entityStates() {
      return entityStateBox.get();
    },
    get entities() {
      const { entityStates } = derived;
      return entityStates[entityStates.length - 1];
    },

    get playerIndex() {
      return derived.entities.findIndex(ent => ent.isPlayer);
    },

    get player() {
      return derived.entities[derived.playerIndex];
    }
  };

  const tryMove = (axis, step) => {
    const playerPos = derived.player.position;
    console.log(axis, step, playerPos.x, playerPos);
    const positionToTry = {
      ...playerPos,
      [axis]: playerPos[axis] + step
    };

    const { entities } = derived;
    const entityThereIndex = entities.findIndex(
      ent =>
        ent.physicalType &&
          ent.position.x === positionToTry.x &&
          ent.position.y === positionToTry.y
    );
    const entityThere = entities[entityThereIndex];
    if (entityThere) {
      if (entityThere.physicalType === physicalTypes.obstacle) {
        return;
      }

      if (entityThere.physicalType === physicalTypes.pushable) {
        const nextPositionOver = {
          ...playerPos,
          [axis]: playerPos[axis] + step * 2
        };
        const nextEntityOver = entities.find(
          ent =>
            ent.physicalType &&
              ent.position.x === nextPositionOver.x &&
              ent.position.y === nextPositionOver.y
        );

        if (nextEntityOver && nextEntityOver.physicalType) {
          return;
        }
        //console.log("st");
        entityStateBox.set([
          ...derived.entityStates,
          ice
            .chain(entities.peek())
            .setIn(
              [entityThereIndex, "position", axis],
              entityThere.position[axis] + step
            )
            .setIn(
              [derived.playerIndex, "position", axis],
              playerPos[axis] + step
            )
            .value()
        ]);

        return;
      }
    }
    entityStateBox.set([
      ...derived.entityStates,
      ice.setIn(
        entities.peek(),
        [derived.playerIndex, "position", axis],
        playerPos[axis] + step
      )
    ]);
    console.log(derived.player.position.x);
  };

  return {
    ...derived,

    tryMoveLeft: () => tryMove("x", -1),
    tryMoveDown: () => tryMove("y", +1),
    tryMoveUp: () => tryMove("y", -1),
    tryMoveRight: () => tryMove("x", +1),
    undo() {
      const { entityStates } = derived;
      if (entityStates.length > 1) {
        entityStateBox.set(entityStates.slice(0, -1));
      }
    },
    reset() {
      entityStates = observable([entityStates[0].peek()]);
    }
  };
};
