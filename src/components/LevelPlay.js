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
  width: 960px;
  max-width: 100vw;
  height: calc(100vh - );
  background: #fafafa;
  flex-direction: column;
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;

  @media screen and (orientation:portrait) {
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
`;

const defaultStore = getLevelPlayStore();
const LevelPlay = observer(({ store = defaultStore }) => {
  const { state } = store;
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
            <GameButton onClick={store.undo}>Undo</GameButton>
            <GameButton onClick={store.reset}>Start Over</GameButton>
            {/*<GameButton onClick={store.gotoEditor}>Edit</GameButton>*/}
          </ButtonContainer>
        </LevelPanel>
      </LevelPlayBox>
    </MainBox>
  );
});

LevelPlay.displayName = "LevelPlay";

window.serializeFocusedComponentProps = () => JSON.stringify(window.$r.props);

export default LevelPlay;
