import React from "react";
import { observer } from "mobx-react";
import Swipeable from "react-swipeable";
import styled from "styled-components";

import LevelView from "./LevelView";
import KeyMap from "./KeyMap";
import { MainBox, GameButton, ButtonContainer } from "./Style";

import { getLevelPlayStore } from "../stores";
import { hasWon } from "../functions";

const LevelPlayBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 620px;
  max-width: 100vw;

  padding: 20px;
  margin: 10px;
  
  background: #fafafa;
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;
`;

const SwipeZone = styled(Swipeable)`
  touch-action: none;
  position: relative;

  width: 100%;
  max-width: 60vh;

  &.victory {
    background: lightgreen;
  }
`;

const Victory = styled.h1`
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  color: white;
  text-shadow:
    -1px -1px 0 #333,  
    1px -1px 0 #333,
    -1px 1px 0 #333,
    1px 1px 0 #333;
  -webkit-text-stroke: 1px #333;
`;

const victoryEl = <Victory>Puzzle Solved!</Victory>;

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  const { state } = store;

  const confirmAndStartOver = () => {
    if (confirm("Are you sure you want to start over?")) {
      store.reset();
    }
  };

  const won = hasWon(state.entities);

  return (
    <MainBox>
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

        <SwipeZone
          onSwipedLeft={store.tryMoveLeft}
          onSwipedDown={store.tryMoveDown}
          onSwipedUp={store.tryMoveUp}
          onSwipedRight={store.tryMoveRight}
          className={hasWon(state.entities) && "victory"}
        >
          <LevelView entities={state.entities} />
          {won && victoryEl}
        </SwipeZone>

        <ButtonContainer className="control-row">
          <GameButton disabled={!store.state.moveCount} onClick={store.undo}>
            Undo
          </GameButton>
          <GameButton disabled={won} onClick={store.tryMoveUp}>
            <div>▲</div>
          </GameButton>
          <GameButton
            disabled={!store.state.moveCount}
            onClick={confirmAndStartOver}
          >
            Start Over
          </GameButton>
          <GameButton disabled={won} onClick={store.tryMoveLeft}>
            <div>◀</div>
          </GameButton>
          <GameButton disabled={won} onClick={store.tryMoveDown}>
            <div>▼</div>
          </GameButton>
          <GameButton disabled={won} onClick={store.tryMoveRight}>
            <div>▶</div>
          </GameButton>
        </ButtonContainer>
      </LevelPlayBox>
    </MainBox>
  );
});

LevelPlay.displayName = "LevelPlay";

window.serializeFocusedComponentProps = () => JSON.stringify(window.$r.props);

export default LevelPlay;
