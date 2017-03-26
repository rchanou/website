import React from "react";
import { observer } from "mobx-react";

import LevelPlay from "./LevelPlay";
import LevelMenu from "./LevelMenu";
import LevelEditor from "./LevelEditor";
import { AppDiv } from "./Style";

import { getGameStore } from "../stores";

const defaultStore = getGameStore();

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
    case "EDITOR":
      ViewToRender = LevelEditor;
      storeToUse = store.editorStore;
      break;
    default:
      ViewToRender = LevelPlay;
      storeToUse = store.levelPlayStore;
  }

  return (
    <AppDiv>
      <ViewToRender store={storeToUse} />
    </AppDiv>
  );
});

export default Game;
