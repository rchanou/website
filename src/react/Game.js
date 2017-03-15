import React from "react";
import { observer } from "mobx-react";

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
      <h2>Sokoban</h2>

      <ViewToRender store={storeToUse} />

      <a href={creditSiteLink} rel="noopener noreferrer" target="_blank">
        Featuring Levels Designed by David W. Skinner
      </a>

      <div>By Ron ChanOu</div>
      <div>
        Full website coming soon! Source viewable
        {" "}
        <a href="https://www.github.com/rchanou/website">here</a>.
      </div>
    </div>
  );
});

export default Game;
