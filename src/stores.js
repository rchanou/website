import { observable, toJS, autorun } from "mobx";
import { groupTypes, physicalTypes, entitySchemas } from "./constants";
import ice from "icepick";

export const createLevelStore = (initialEntities = []) => {
  const state = observable({
    entityStates: [initialEntities],

    get entities() {
      const { entityStates } = state;
      return entityStates[entityStates.length - 1];
    },

    get playerIndex() {
      return state.entities.findIndex(ent => ent.isPlayer);
    },

    get player() {
      return state.entities[state.playerIndex];
    },

    get moveCount() {
      return state.entityStates.length - 1;
    }
  });

  const tryMove = (axis, step) => {
    if (!state.player) {
      return;
    }

    const playerPos = state.player.position;
    //console.log(axis, step, playerPos.x, playerPos);
    const positionToTry = {
      ...playerPos,
      [axis]: playerPos[axis] + step
    };

    const { entities } = state;
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
        state.entityStates.push(
          ice
            .chain(entities.peek())
            .setIn(
              [entityThereIndex, "position", axis],
              entityThere.position[axis] + step
            )
            .setIn(
              [state.playerIndex, "position", axis],
              playerPos[axis] + step
            )
            .value()
        );

        return;
      }
    }
    state.entityStates.push(
      ice.setIn(
        entities.peek(),
        [state.playerIndex, "position", axis],
        playerPos[axis] + step
      )
    );
    //console.log(state.player.position.x);
  };

  return {
    state,

    tryMoveLeft: () => tryMove("x", -1),
    tryMoveDown: () => tryMove("y", +1),
    tryMoveUp: () => tryMove("y", -1),
    tryMoveRight: () => tryMove("x", +1),
    undo() {
      const { entityStates } = state;
      if (entityStates.length > 1) {
        state.entityStates.pop();
      }
    },
    reset() {
      state.entityStates = [state.entityStates[0]];
    }
  };
};

export const createMenuStore = ({ levels, selectedLevelId = null }) => {
  const state = observable({
    levels,
    selectedLevelId
  });

  return { state };
};

export const createGameStore = ({ menuState }) => {
  const state = {
    menu: createMenuStore(menuState),
    level: createLevelStore(levelState),
    currentPage: "menu"
  };
};
