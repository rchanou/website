import React from "react";
import { autorun, createTransformer } from "mobx";
import { observer, Observer } from "mobx-react";

import LevelView from "./LevelView";
import LevelControls from "./Controls";
import KeyMap from "./KeyMap";
import { GameButton, ButtonContainer } from "./Style";

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

const Game = observer(({ store }) => {
  const { levelPlayStore, menuStore } = store;
  return (
    <div>
      <KeyMap
        default={console.log}
        keyMap={{
          ArrowLeft: levelPlayStore.tryMoveLeft,
          ArrowDown: levelPlayStore.tryMoveDown,
          ArrowUp: levelPlayStore.tryMoveUp,
          ArrowRight: levelPlayStore.tryMoveRight,
          e: levelPlayStore.tryMoveUp,
          s: levelPlayStore.tryMoveLeft,
          d: levelPlayStore.tryMoveDown,
          f: levelPlayStore.tryMoveRight,
          u: levelPlayStore.undo,
          " ": levelPlayStore.undo,
          Escape: levelPlayStore.reset
        }}
      />

      <div
        style={{
          background: hasWon(levelPlayStore.state.entities) ? "aquamarine" : "#eee",
          height: 555,
          width: 555,
          padding: 22
        }}
      >
        <LevelView entities={levelPlayStore.state.entities} />
      </div>

      <div>{levelPlayStore.state.moveCount}</div>
      <LevelControls store={levelPlayStore} />
      <ButtonContainer>
        <GameButton onClick={levelPlayStore.undo}>Undo</GameButton>
        <GameButton onClick={levelPlayStore.reset}>Reset</GameButton>
      </ButtonContainer>
    </div>
  );
});

Game.displayName = "Game";

//autorun(o => console.log(defaultStore.entities));

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Game;
