import { observable, toJS, autorun } from "mobx";
import { groupTypes, physicalTypes, entitySchemas } from "./constants";
import ice from "icepick";
import update from "immutability-helper";

export const createLevelStore = ({ initialLevelState = [], moves = [] }) => {
  const state = observable({
    levelStates: [initialLevelState],

    moves,

    get entities() {
      const result = state.moves.reduce(
        (runningState, nextMove) => {
          return Object.entries(nextMove).reduce(
            (runningState, [id, position]) => {
              const indexToMove = runningState.findIndex(ent => ent.id == id);

              if (indexToMove === -1) {
                return runningState;
              }

              const newPos = {
                ...runningState[indexToMove].position,
                ...nextMove[id]
              };

              return update(runningState, {
                [indexToMove]: {
                  position: { $set: newPos }
                }
              });
            },
            runningState
          );
        },
        initialLevelState
      );
      //console.log(result[11].position);
      return result;
    },

    get playerIndex() {
      return state.entities.findIndex(ent => ent.isPlayer);
    },

    get player() {
      return state.entities[state.playerIndex];
    },

    get moveCount() {
      return state.moves.length;
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
        
        state.moves.push({
          [entityThere.id]: {
            ...entityThere.position,
            [axis]: entityThere.position[axis] + step
          },
          [state.player.id]: {
            ...playerPos,
            [axis]: playerPos[axis] + step
          }
        });
        return;
      }
    }
    state.moves.push({
      [state.player.id]: {
        ...playerPos,
        [axis]: playerPos[axis] + step
      }
    });
    //console.log(state.player.position.x);
  };

  return {
    state,

    tryMoveLeft: () => tryMove("x", -1),
    tryMoveDown: () => tryMove("y", +1),
    tryMoveUp: () => tryMove("y", -1),
    tryMoveRight: () => tryMove("x", +1),
    undo() {
      if (state.moves.length) {
        state.moves.pop();
      }
    },
    reset() {
      state.moves = [];
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
