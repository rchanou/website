import { observable, toJS } from "mobx";
import update from "immutability-helper";
import shortid from "shortid";

import { groupTypes, physicalTypes, entitySchemas } from "./constants";

const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";

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
    firstLoadDone = false,
    records = []
  } = initialState;

  const state = observable({
    firstLoadDone,
    records
  });

  const pullRecords = () => {
    const task = fetch(
      "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/getSokobanLevels"
    )
      .then(res => res.json())
      .then(records => {
        state.firstLoadDone = true;
        state.records = records;
      })
      .catch(e => {
        alert(
          "An error occurred loading the levels. Refresh the page to try again"
        );
        state.firstLoadDone = true;
        console.error(e);
      });
    return task;
  };
  pullRecords();

  return { state, pullRecords };
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
    goBack = o => o,
    reload = o => console.log("no relaod")
  } = initial;

  const state = observable({
    level: [],
    submitting: false,
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

  const submit = async captchaObj => {
    //console.log('submit', captchaObj)

    state.submitting = true;
    const id = state.id || shortid.generate();
    const task = fetch(submitUrl, {
      method: "POST",
      body: JSON.stringify({
        ...captchaObj,
        doc: { id, level: state.level }
      }),
      headers: new Headers({ "Content-Type": "application/json" })
    }).catch(e => {
      alert("An error occurred.");
      console.error(e);
    });

    const response = await task;

    if (
      response &&
      typeof response === "object" &&
      typeof response.json === "function"
    ) {
      const responseBody = await response.json();
      if (response.status === 200) {
        alert("Level successfully saved!");
        reload(id);
        goBack();
      } else {
        if (responseBody.message) {
          alert(responseBody.message);
        } else {
          alert("An error occurred.");
          console.error(responseBody);
        }
      }
    }
    state.submitting = false;
  };

  const bindMove = (axis, dir) => e => {
    if (e && typeof e === "object" && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const nextAxisPos = state.editingPos[axis] + dir;
    state.editingPos[axis] = nextAxisPos > state.bound - 1
      ? 0
      : nextAxisPos < 0 ? state.bound - 1 : nextAxisPos;
  };

  const bindPlace = group => e => {
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
    reload,
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
    editorStore = getEditorStore({
      reload: async id => {
        await levelRecordStore.pullRecords();
        menuStore.loadLevel(id);
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
