import React from "react";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

import LevelPlay from "./LevelPlay";
import LevelMenu from "./LevelMenu";
import LevelEditor from "./LevelEditor";

import { getGameStore } from "../stores";

const defaultStore = getGameStore();
window.g = defaultStore;
const Game = observer(({ store = defaultStore }) => {
  let ViewToRender, storeToUse;
  switch (store.state.currentView) {
    case "MENU":
      ViewToRender = LevelMenu;
      storeToUse = store.menuStore;
      break;
    case "PLAY":
      ViewToRender = LevelPlay;
      storeToUse = store.levelPlayStore;
      break;
    case "PLAY":
      ViewToRender = LevelPlay;
      storeToUse = store.levelPlayStore;
      break;
    default:
      ViewToRender = LevelEditor;
      storeToUse = store.editorStore;
  }

  return (
    <div>
      <ViewToRender store={storeToUse} />
      <DevTools />
    </div>
  );
});

export default Game;
