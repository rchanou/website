import { observable } from "mobx";
import update from "immutability-helper";
import shortid from "shortid";
import { findIndex } from "lodash";

import { groupTypes, physicalTypes, entitySchemas } from "../constants";
import { compactPuzzle, hasWon } from "../functions";

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
              const indexToMove = findIndex(levelAtSubMove, { id });

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

    if (hasWon(state.entities)) {
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
    levelRecordStore = getLevelRecordStore(),
    goBack = o => o
  } = initial;

  const state = observable({
    highlightedLevelId: -1,
    ...initialState
  });

  const selectLevel = id => {
    state.highlightedLevelId = id === state.highlightedLevelId ? -1 : id;
  };

  return { state, levelRecordStore, selectLevel, goBack };
};

export const getEditorStore = (initial = {}) => {
  const {
    initialState = {},
    goBack = o => o,
    reload = o => o,
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

  const bindPlace = (...groups) =>
    e => {
      if (e) {
        e.preventDefault();
      }

      clearAtPos(state.editingPos);

      for (const group of groups) {
        const action = entitySchemas[group].group === groupTypes.target
          ? "unshift"
          : "push";
        state.level[action]({
          id: shortid.generate(),
          ...entitySchemas[group],
          position: { ...state.editingPos }
        });
      }
    };

  const placeSpace = bindPlace();
  const placeWall = bindPlace("wall");
  const placeBox = bindPlace("box");
  const placeTarget = bindPlace("target");
  const placeBoxTarget = bindPlace("target", "box");

  const setFromClick = e => {
    console.log("u wot ", e);
    const x = Math.floor(
      state.bound * ((e.pageX - e.target.offsetLeft) / e.target.offsetWidth)
    );
    const y = Math.floor(
      state.bound * ((e.pageY - e.target.offsetTop) / e.target.offsetHeight)
    );
    state.editingPos = { x, y };
  };

  const setFromPress = e => {
    console.log(e);
    e.preventDefault();

    const entsAtPos = state.level.filter(
      ent =>
        !ent.isPlayer &&
        ent.position.x === state.editingPos.x &&
        ent.position.y === state.editingPos.y
    );

    if (!entsAtPos.length) {
      // empty space
      placeWall();
    } else if (entsAtPos.length > 1) {
      // box and target most likely
      placeSpace();
    } else {
      switch (entsAtPos[0].group) {
        case groupTypes.wall:
          placeBox();
          break;
        case groupTypes.box:
          placeTarget();
          break;
        case groupTypes.target:
          placeBoxTarget();
          break;
        default:
      }
    }
  };

  const placePlayer = e => {
    if (e) {
      e.preventDefault();
    }
    state.level = state.level.filter(ent => ent.group !== groupTypes.player);
    state.level.push({
      id: shortid.generate(),
      ...entitySchemas.player,
      position: { ...state.editingPos }
    });
  };

  const setPlayer = e => {
    if (e instanceof TouchEvent) {
      setFromClick(e.touches[0]);
    } else {
      setFromClick(e);
    }
    placePlayer();
  };

  const submit = captchaObj => {
    state.submission = {
      ...captchaObj,
      doc: {
        id: state.id || shortid.generate(),
        level: compactPuzzle(state.level)
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

  return {
    state,

    setFromPress,
    setFromClick,

    submit,
    closeSubmit,
    goBack,
    reload,
    loadLevelRecord,

    moveLeft: bindMove("x", -1),
    moveDown: bindMove("y", +1),
    moveUp: bindMove("y", -1),
    moveRight: bindMove("x", +1),

    placePlayer,
    setPlayer,

    placeSpace,
    placeWall,
    placeBox,
    placeTarget,
    placeBoxTarget
  };
};

export const getGameStore = (initial = {}) => {
  const {
    initialState,
    levelRecordStore = getLevelRecordStore(),
    menuStore = getMenuStore({ levelRecordStore }),
    levelPlayStore = getLevelPlayStore(),
    editorStore = getEditorStore({
      reload: id => {
        levelRecordStore.state.attemptingLoad = true;
        menuStore.loadLevel(id);
      },
      loadLevelRecord(record) {
        const { records } = levelRecordStore.state;
        const levelIndex = findIndex(records, { id: record.id });
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
    state.currentView = editorStore.state.id ? "PLAY" : "MENU";
  };

  menuStore.loadLevel = id => {
    id = id == null ? menuStore.state.highlightedLevelId : id;
    const recordToLoad = levelRecordStore.state.records.find(r => r.id === id);

    if (!recordToLoad) {
      menuStore.state.highlightedLevelId = null;
      state.currentView = "EDITOR";
      return;
    }

    levelPlayStore.state.moves = [];
    levelPlayStore.state.levelStart = recordToLoad.level;
    state.currentView = "PLAY";
    menuStore.state.highlightedLevelId = id;
  };

  menuStore.gotoCreateLevel = o => {
    editorStore.state.id = null;
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
