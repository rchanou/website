import { observable, toJS, autorun } from "mobx";
import { groupTypes, physicalTypes, entitySchemas } from "./constants";
import ice from "icepick";
import update from "immutability-helper";

const baseLevel = [
  { group: "TARGET", id: 15, position: { y: 3, x: 5 } },
  { group: "TARGET", id: 10, position: { y: 2, x: 3 } },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 0,
    position: { y: 0, x: 1 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 1,
    position: { y: 0, x: 2 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 2,
    position: { y: 0, x: 3 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 3,
    position: { y: 0, x: 4 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 4,
    position: { y: 0, x: 5 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 5,
    position: { y: 0, x: 6 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 6,
    position: { y: 1, x: 1 }
  },
  {
    isPlayer: true,
    group: "PLAYER",
    physicalType: "OBSTACLE",
    id: 7,
    position: { y: 1, x: 2 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 8,
    position: { y: 1, x: 6 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 9,
    position: { y: 2, x: 1 }
  },
  {
    group: "BOX",
    physicalType: "PUSHABLE",
    id: 11,
    position: { y: 2, x: 3 }
  },
  {
    group: "BOX",
    physicalType: "PUSHABLE",
    id: 12,
    position: { y: 2, x: 5 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 13,
    position: { y: 2, x: 6 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 14,
    position: { y: 3, x: 1 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 16,
    position: { y: 3, x: 6 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 17,
    position: { y: 4, x: 1 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 18,
    position: { y: 4, x: 2 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 19,
    position: { y: 4, x: 3 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 20,
    position: { y: 4, x: 4 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 21,
    position: { y: 4, x: 5 }
  },
  {
    group: "WALL",
    physicalType: "OBSTACLE",
    id: 22,
    position: { y: 4, x: 6 }
  }
];

export const getLevelPlayStore = (
  initialState = {} //goBack = o => o,
) => //gotoEditor = o => o
{
  const {
    levelStart = baseLevel || [],
    moves = []
  } = initialState;

  const state = observable({
    levelStart,

    moves,

    get entities() {
      const result = state.moves.reduce(
        (levelAtMove, nextMove) => {
          return Object.entries(nextMove).reduce(
            (levelAtSubMove, [id, position]) => {
              const indexToMove = levelAtSubMove.findIndex(ent => ent.id == id);

              if (indexToMove === -1) {
                return levelAtSubMove;
              }

              const newPos = {
                ...levelAtSubMove[indexToMove].position,
                ...nextMove[id]
              };

              return update(levelAtSubMove, {
                [indexToMove]: {
                  position: { $set: newPos }
                }
              });
            },
            levelAtMove
          );
        },
        state.levelStart
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
    //goBack,
    //gotoEditor
  };
};
export const getLevelRecordStore = (initialState = {}) => {
  const {
    records = [
      { id: 0, level: baseLevel },
      ...[1, 2, 3, 4, 5, 6, 7].map(x => ({
        id: x,
        level: baseLevel.filter(o => Math.random() < 0.5)
      })),
      { id: 8, level: baseLevel.filter(ent => ent.position.x < 3) },
      { id: 9, level: baseLevel.filter(ent => ent.position.y < 3) }
    ]
  } = initialState;

  const state = observable({
    records
  });

  const pullRecords = o => {
    fetch(
      "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/getSokobanLevels"
    )
      .then(res => res.json())
      .then(records => {
        state.records = records;
      });
  };
  pullRecords();

  const createLevel = e => {
    e.preventDefault();
    const formData = serialize(e.target, { hash: true });
    formData.doc = { id: "stupid", level: [] };
    const body = JSON.stringify(formData);
    fetch(submitUrl, {
      method: "POST",
      body,
      headers: new Headers({ "Content-Type": "application/json" })
    })
      .then(res => res.json())
      .then(console.log);
  };

  // TODO: db logic
  return { state };
};

export const getMenuStore = (initial = {}) => {
  const {
    initialState = {},
    levelRecordStore = getLevelRecordStore(),
    goBack = o => o
  } = initial;

  const state = observable({
    highlightedLevelId: -1,
    ...initialState
  });

  const selectLevel = id => {
    state.highlightedLevelId = id == state.highlightedLevelId ? -1 : id;
  };

  return {
    state,
    levelRecordStore,
    selectLevel
  };
};

export const getEditorStore = (initial = {}) => {
  const {
    initialState = {},
    goBack = o => o
  } = initial;

  const state = observable({ level: [], submitting: false, ...initialState });

  return {
    state
  };
};

export const getGameStore = (initial = {}) => {
  const {
    initialState,
    levelRecordStore = getLevelRecordStore(),
    menuStore = getMenuStore({ levelRecordStore }),
    levelPlayStore = getLevelPlayStore(),
    editorStore = getEditorStore()
  } = initial;

  const state = observable({
    currentView: "MENU",
    ...initialState
  });

  menuStore.loadLevel = id => {
    id = id === null ? menuStore.state.highlightedLevelId : id;
    const recordToLoad = levelRecordStore.state.records.find(r => r.id == id);

    if (!recordToLoad) {
      console.warn("Level not found!");
      return;
    }

    levelPlayStore.state.moves = [];
    levelPlayStore.state.levelStart = recordToLoad.level;
    state.currentView = "PLAY";
    menuStore.state.highlightedLevelId = id;
  };

  levelPlayStore.goBack = o => {
    state.currentView = "MENU";
  };

  levelPlayStore.gotoEditor = () => {
    editorStore.state.id = menuStore.state.highlightedLevelId; // normalize?
    editorStore.state.level = levelPlayStore.state.levelStart;
    state.currentView = "EDITOR";
  };

  editorStore.goBack = () => {
    state.currentView = "PLAY";
  };

  return {
    state,
    menuStore,
    levelRecordStore,
    levelPlayStore,
    editorStore
  };
};
