import React from "react";
import { autorun, createTransformer } from "mobx";
import { observer, Observer } from "mobx-react";
import Swipeable from "react-swipeable";
import styled from "styled-components";
import Meta from "react-document-meta";
import { applyContainerQuery } from "react-container-query";

import LevelView from "./LevelView";
import LevelControls from "./Controls";
import KeyMap from "./KeyMap";
import { FullDiv, GameButton, ButtonContainer } from "./Style";

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

const playContainerQuery = {
  thin: {
    maxWidth: 222
  }
};

const LevelPlayBox = styled.div`
  display: flex;
  max-width: 100vw;
  max-height: 100vh;

  @media screen and (orientation:portrait) {
    flex-direction: column;
  }

  @media screen and (orientation:landscape){
  }
`;

const LevelViewBox = styled(Swipeable)`
  background: #eee;
  touch-action: none;
  max-width: 80vh;
  padding: 22px;

  &.victory {
    background: aquamarine;
  }
`;

const LevelPanel = styled.div`
  display: flex;
  
  @media screen and (orientation:portrait) {
    --width: 100%;
    --max-height: calc(20vh - 2em);
  }
  
  @media screen and (orientation:landscape) {
    width: 50%;
    flex-direction: column;
  }
`;

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  return (
    <LevelPlayBox>
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

      <FullDiv>
        <h2>Moves: {store.state.moveCount}</h2>

        <LevelViewBox
          onSwipedLeft={store.tryMoveLeft}
          onSwipedDown={store.tryMoveDown}
          onSwipedUp={store.tryMoveUp}
          onSwipedRight={store.tryMoveRight}
          className={hasWon(store.state.entities) && "victory"}
        >
          <LevelView entities={store.state.entities} />
        </LevelViewBox>
      </FullDiv>

      <FullDiv>
        <LevelPanel>
          <Meta
            content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
            meta={{
              content: "width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
            }}
          />

          <LevelControls store={store} />

          <ButtonContainer>
            <GameButton onClick={store.undo}>Undo</GameButton>
            <GameButton onClick={store.reset}>Start Over</GameButton>
            <GameButton onClick={store.gotoEditor}>Edit</GameButton>
            <GameButton onClick={store.goBack}>Menu</GameButton>
          </ButtonContainer>
        </LevelPanel>
      </FullDiv>
    </LevelPlayBox>
  );
});

LevelPlay.displayName = "LevelPlay";

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default LevelPlay;
