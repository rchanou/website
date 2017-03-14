import React from "react";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

import LevelPlay from "./LevelPlay";
import LevelMenu from "./LevelMenu";
import LevelEditor from "./LevelEditor";

import { getGameStore } from "../stores";

const creditSiteLink = "http://www.onlinespiele-sammlung.de/sokoban/sokobangames/skinner";

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
    <div style={{ fontFamily: "sans-serif" }}>
      <ViewToRender store={storeToUse} />
      <DevTools />

      <a href={creditSiteLink} rel="noopener noreferrer" target="_blank">
        Featuring Levels Designed by David W. Skinner
      </a>
    </div>
  );
});

export default Game;
