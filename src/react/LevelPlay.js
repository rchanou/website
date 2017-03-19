import React from "react";
import { autorun, createTransformer } from "mobx";
import { observer, Observer } from "mobx-react";
import Swipeable from "react-swipeable";
import styled from "styled-components";

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

const LevelPlayContainer = styled.div`
  display: flex;
  width: 555px;
  max-width: 100vw;

  @media screen and (orientation:portrait) {
    flex-direction: column;
    align-items: center;
  }

  @media screen and (orientation:landscape){
  }
`;

const LevelPanel = styled.div`
  display: flex;
  
  @media screen and (orientation:portrait) {
    width: 100%;
  }
  
  @media screen and (orientation:landscape) {
    flex-direction: column;
  }
`;

const MoveDisplay = styled.div`
  font-size: 2.33em;
`;

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  return (
    <LevelPlayContainer>
      <KeyMap
        keyMap={{
          ArrowLeft: store.tryMoveLeft,
          ArrowDown: store.tryMoveDown,
          ArrowUp: store.tryMoveUp,
          ArrowRight: store.tryMoveRight,
          Left: store.tryMoveLeft,
          Down: store.tryMoveDown,
          Up: store.tryMoveUp,
          Right: store.tryMoveRight,
          e: store.tryMoveUp,
          s: store.tryMoveLeft,
          d: store.tryMoveDown,
          f: store.tryMoveRight,
          u: store.undo,
          " ": store.undo,
          Spacebar: store.undo,
          Escape: store.reset,
          Esc: store.reset
        }}
      />

      <Swipeable
        onSwipedLeft={store.tryMoveLeft}
        onSwipedDown={store.tryMoveDown}
        onSwipedUp={store.tryMoveUp}
        onSwipedRight={store.tryMoveRight}
        style={{
          background: hasWon(store.state.entities) ? "aquamarine" : "#eee",
          touchAction: "none",
          width: "100%",
          padding: 22
        }}
      >
        <LevelView entities={store.state.entities} />
      </Swipeable>

      <LevelPanel>
        <MoveDisplay>
          Moves: {store.state.moveCount}
        </MoveDisplay>

        <LevelControls store={store} />

        <ButtonContainer>
          <GameButton onClick={store.undo}>Undo</GameButton>
          <GameButton onClick={store.reset}>Start Over</GameButton>
          <GameButton onClick={store.gotoEditor}>Edit</GameButton>
          <GameButton onClick={store.goBack}>Menu</GameButton>
        </ButtonContainer>
      </LevelPanel>
    </LevelPlayContainer>
  );
});

LevelPlay.displayName = "LevelPlay";

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default LevelPlay;
