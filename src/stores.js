import { observable, toJS } from "mobx";
import update from "immutability-helper";
import shortid from "shortid";

import { groupTypes, physicalTypes, entitySchemas } from "./constants";

export const getLevelPlayStore = (initialState = {}) => {
  const {
    levelStart = [],
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

export const getLevelRecordStore = (initialState = {}) => {
  const {
    attemptingLoad = true,
    records = []
  } = initialState;

  const state = observable({
    attemptingLoad,
    records
  });

  const loadRecords = recordsToLoad => {
    console.log(recordsToLoad, "to load");
    state.records = recordsToLoad;
    state.attemptingLoad = false;
  };

  const finishLoad = () => {
    state.attemptingLoad = false;
  };

  return { state, loadRecords, finishLoad };
};

export const getMenuStore = (initial = {}) => {
  const {
    initialState = {},
    levelRecordStore, // = getLevelRecordStore(),
    goBack = o => o
  } = initial;

  const state = observable({
    highlightedLevelId: -1,
    ...initialState
  });

  const selectLevel = id => {
    state.highlightedLevelId = id == state.highlightedLevelId ? -1 : id;
  };

  return { state, levelRecordStore, selectLevel };
};

export const getEditorStore = (initial = {}) => {
  const {
    initialState = {},
    goBack = o => o,
    reload = o => console.log("no reload"),
    loadLevelRecord = o => o
  } = initial;

  const state = observable({
    level: [],
    submission: false,
    bound: 20,
    editingPos: { x: 9, y: 9 },
    ...initialState
  });

  const clearAtPos = ({ x, y }) => {
    state.level = state.level.filter(
      ent => ent.position.x !== x || ent.position.y !== y
    );
  };

  const changeFromClick = e => {
    const x = Math.floor(
      state.bound * ((e.pageX - e.target.offsetLeft) / e.target.offsetWidth)
    );
    const y = Math.floor(
      state.bound * ((e.pageY - e.target.offsetTop) / e.target.offsetHeight)
    );

    state.editingPos = { x, y };
  };

  const submit = captchaObj => {
    state.submission = {
      ...captchaObj,
      doc: {
        id: state.id || shortid.generate(),
        level: state.level
      }
    };
  };

  const closeSubmit = () => {
    state.submission = false;
  };

  const bindMove = (axis, dir) =>
    e => {
      if (
        e && typeof e === "object" && typeof e.preventDefault === "function"
      ) {
        e.preventDefault();
      }

      const nextAxisPos = state.editingPos[axis] + dir;
      state.editingPos[axis] = nextAxisPos > state.bound - 1
        ? 0
        : nextAxisPos < 0 ? state.bound - 1 : nextAxisPos;
    };

  const bindPlace = group =>
    e => {
      e.preventDefault();
      clearAtPos(state.editingPos);
      state.level.push({
        id: shortid.generate(),
        ...entitySchemas[group],
        position: { ...state.editingPos }
      });
    };

  return {
    state,

    changeFromClick,
    submit,
    closeSubmit,
    reload,
    loadLevelRecord,

    moveLeft: bindMove("x", -1),
    moveDown: bindMove("y", +1),
    moveUp: bindMove("y", -1),
    moveRight: bindMove("x", +1),
    // TODO: DRY
    placeSpace(e) {
      e.preventDefault();
      clearAtPos(state.editingPos);
    },
    placePlayer(e) {
      e.preventDefault();
      state.level = state.level.filter(ent => ent.group !== groupTypes.player);
      state.level.push({
        id: shortid.generate(),
        ...entitySchemas.player,
        position: { ...state.editingPos }
      });
    },
    placeWall: bindPlace("wall"),
    placeBox: bindPlace("box"),
    placeTarget(e) {
      e.preventDefault();
      clearAtPos(state.editingPos);
      state.level.unshift({
        id: shortid.generate(),
        ...entitySchemas.target,
        position: { ...state.editingPos }
      });
    },
    placeBoxTarget(e) {
      e.preventDefault();
      clearAtPos(state.editingPos);
      state.level.unshift({
        id: shortid.generate(),
        ...entitySchemas.target,
        position: { ...state.editingPos }
      });
      state.level.push({
        id: shortid.generate(),
        ...entitySchemas.box,
        position: { ...state.editingPos }
      });
    },
    placePlayerTarget(e) {
      e.preventDefault();
      clearAtPos(state.editingPos);
      state.level = state.level.filter(ent => ent.group !== groupTypes.player);
      state.level.unshift({
        id: shortid.generate(),
        ...entitySchemas.target,
        position: { ...state.editingPos }
      });
      state.level.push({
        id: shortid.generate(),
        ...entitySchemas.player,
        position: { ...state.editingPos }
      });
    }
  };
};

export const getGameStore = (initial = {}) => {
  const {
    initialState,
    levelRecordStore = getLevelRecordStore(),
    menuStore = getMenuStore({ levelRecordStore }),
    levelPlayStore = getLevelPlayStore(),
    //await levelRecordStore.pullRecords();
    editorStore = getEditorStore({
      reload: id => {
        levelRecordStore.state.attemptingLoad = true;
        menuStore.loadLevel(id);
      },
      loadLevelRecord(record) {
        const { records } = levelRecordStore.state;
        const levelIndex = records.findIndex(rec => rec.id === record.id);
        if (levelIndex === -1) {
          records.push(record);
        } else {
          records[levelIndex] = record;
        }
        menuStore.loadLevel(record.id);
      }
    })
  } = initial;

  const state = observable({
    currentView: "MENU",
    ...initialState
  });

  editorStore.goBack = o => {
    state.currentView = "PLAY";
  };

  menuStore.loadLevel = id => {
    id = id == null ? menuStore.state.highlightedLevelId : id;
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

  menuStore.gotoCreateLevel = o => {
    editorStore.state.level = [];
    menuStore.state.highlightedLevelId = null;
    state.currentView = "EDITOR";
  };

  levelPlayStore.goBack = o => {
    state.currentView = "MENU";
  };

  levelPlayStore.gotoEditor = () => {
    editorStore.state.id = menuStore.state.highlightedLevelId; // normalize?
    editorStore.state.level = levelPlayStore.state.levelStart;
    state.currentView = "EDITOR";
  };

  return {
    state,
    menuStore,
    levelRecordStore,
    levelPlayStore,
    editorStore
  };
};
