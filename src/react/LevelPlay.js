import React from "react";
import { autorun, createTransformer } from "mobx";
import { observer, Observer } from "mobx-react";

import LevelView from "./LevelView";
import LevelControls from "./Controls";
import KeyMap from "./KeyMap";
import { GameButton, ButtonContainer } from "./Style";

import { getLevelPlayStore } from "../stores";
import { groupTypes } from "../constants";

const hasWon = createTransformer(entities => {
  const targets = entities.filter(ent => ent.group === groupTypes.target);
  const boxes = entities.filter(ent => ent.group === groupTypes.box);
  for (const target of targets) {
    const targetPos = target.position;
    if (
      !boxes.find(
        box => box.position.x === targetPos.x && box.position.y === targetPos.y
      )
    ) {
      return false;
    }
  }
  return true;
});

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  return (
    <div>
      <KeyMap
        default={console.log}
        keyMap={{
          ArrowLeft: store.tryMoveLeft,
          ArrowDown: store.tryMoveDown,
          ArrowUp: store.tryMoveUp,
          ArrowRight: store.tryMoveRight,
          e: store.tryMoveUp,
          s: store.tryMoveLeft,
          d: store.tryMoveDown,
          f: store.tryMoveRight,
          u: store.undo,
          " ": store.undo,
          Escape: store.reset
        }}
      />

      <div
        style={{
          background: hasWon(store.state.entities) ? "aquamarine" : "#eee",
          height: 555,
          width: 555,
          padding: 22
        }}
      >
        <LevelView entities={store.state.entities} />
      </div>

      <div>{store.state.moveCount}</div>
      <LevelControls store={store} />
      <ButtonContainer>
        <GameButton onClick={store.undo}>Undo</GameButton>
        <GameButton onClick={store.reset}>Reset</GameButton>
        <GameButton onClick={store.gotoEditor}>Edit</GameButton>
        <GameButton onClick={store.goBack}>Menu</GameButton>
      </ButtonContainer>
    </div>
  );
});

LevelPlay.displayName = "LevelPlay";

//autorun(o => console.log(defaultStore.entities));

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default LevelPlay;
