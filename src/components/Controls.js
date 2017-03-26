import React from "react";
import styled from "styled-components";

import { GameButton } from "./Style";
import { getLevelPlayStore } from "../stores";

const squareMargin = 50 * (Math.sqrt(2) - 1);

const ScaleableSquare = styled.div`
  display: flex;
  position: relative;

  @media screen and (orientation:portrait) {
    width: 50%;
    margin: 9%;
  }

  @media screen and (orientation:landscape){
    margin: ${squareMargin / 2}%;
  }

  &:after {
    content: '';
    margin-top: 100%;
    display: flex;
    --justify-content: center;
    --align-items: center;
  }

  & > * {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const Arrows = styled.div`
  display: flex;
  flex-wrap: wrap;
  transform-origin: 50% 50%;
  transform: rotate(45deg);

  & button {
    width: 50%;
    height: 50%;
    --font-size: 2.11em;
  }
  
  @media screen and (orientation:landscape){   
    & button {
      font-size: 2.11em;  
    }
  }

  & > button > div {
    transform-origin: 50% 50%;
    transform: rotate(-45deg);
  }
`;

const Controls = ({ store = getLevelPlayStore() }) => (
  <ScaleableSquare>
    <Arrows>
      <GameButton onClick={store.tryMoveUp}><div>▲</div></GameButton>
      <GameButton onClick={store.tryMoveRight}><div>▶</div></GameButton>
      <GameButton onClick={store.tryMoveLeft}><div>◀</div></GameButton>
      <GameButton onClick={store.tryMoveDown}><div>▼</div></GameButton>
    </Arrows>
  </ScaleableSquare>
);

export default Controls;
