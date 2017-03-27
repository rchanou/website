import React from "react";
import { observer } from "mobx-react";
import Swipeable from "react-swipeable";
import styled from "styled-components";

import LevelView from "./LevelView";
import LevelControls from "./Controls";
import KeyMap from "./KeyMap";
import { MainBox, GameButton, ButtonContainer } from "./Style";

import { getLevelPlayStore } from "../stores";
import { hasWon } from "../functions";

const LevelPlayBox = styled.div`
  display: flex;
  width: 620px;
  max-width: 100vw;
  //height: calc(100vh - );
  background: #fafafa;
  flex-direction: column;
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;
  padding: 20px;
  margin: 10px;
`;

const LevelViewBox = styled(Swipeable)`
  touch-action: none;

  &.victory {
    background: lightgreen;
  }
`;

const LevelPanel = styled.div`
  display: flex;
`;

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  const { state } = store;

  const confirmAndStartOver = () => {
    if (confirm("Are you sure you want to start over?")) {
      store.reset();
    }
  };

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

        <LevelViewBox
          onSwipedLeft={store.tryMoveLeft}
          onSwipedDown={store.tryMoveDown}
          onSwipedUp={store.tryMoveUp}
          onSwipedRight={store.tryMoveRight}
          className={hasWon(state.entities) && "victory"}
        >
          <LevelView entities={state.entities} />
        </LevelViewBox>

        <LevelPanel>
          {hasWon(state.entities)
            ? <h1>Great Job!</h1>
            : <LevelControls store={store} />}

          <ButtonContainer>
            <GameButton disabled={!store.state.moveCount} onClick={store.undo}>
              Undo
            </GameButton>
            <GameButton
              disabled={!store.state.moveCount}
              onClick={confirmAndStartOver}
            >
              Start Over
            </GameButton>
          </ButtonContainer>
        </LevelPanel>
      </LevelPlayBox>
    </MainBox>
  );
});

LevelPlay.displayName = "LevelPlay";

window.serializeFocusedComponentProps = () => JSON.stringify(window.$r.props);

export default LevelPlay;
