import React from "react";
import { observer } from "mobx-react";
import Swipeable from "react-swipeable";
import styled from "styled-components";

import LevelView from "./LevelView";
import LevelControls from "./Controls";
import KeyMap from "./KeyMap";
import { FullDiv, GameButton, ButtonContainer } from "./Style";

import { getLevelPlayStore } from "../stores";
import { hasWon } from "../functions";

const LevelPlayBox = styled.div`
  display: flex;
  max-width: 100vw;
  max-height: 100vh;
  background: #fafafa;

  @media screen and (orientation:portrait) {
    flex-direction: column;
  }

  @media screen and (orientation:landscape){
  }
`;

const LevelViewBox = styled(Swipeable)`
  touch-action: none;
  max-width: 80vh;
  padding: 22px;

  &.victory {
    background: lightgreen;
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

const ScorePanel = styled.div`
  padding: 9.999px;
  color: #333;
  font-size: 2.34em;
  display: flex;
  justify-content: space-between;
`;

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  const { state } = store;
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
        <ScorePanel>
          <span>Moves: {store.state.moveCount}</span>
          {hasWon(state.entities) && <span>Great Job!</span>}
        </ScorePanel>

        <LevelViewBox
          onSwipedLeft={store.tryMoveLeft}
          onSwipedDown={store.tryMoveDown}
          onSwipedUp={store.tryMoveUp}
          onSwipedRight={store.tryMoveRight}
          className={hasWon(state.entities) && "victory"}
        >
          <LevelView entities={state.entities} />
        </LevelViewBox>
      </FullDiv>

      <FullDiv>
        <LevelPanel>
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

window.serializeFocusedComponentProps = () => JSON.stringify(window.$r.props);

export default LevelPlay;
