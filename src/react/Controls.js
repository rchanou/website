import React from "react";
import { ButtonContainer, GameButton } from "./Style";
import { getLevelPlayStore } from "../stores";

const Controls = ({ store = getLevelPlayStore() }) => (
  <ButtonContainer>
    <GameButton onClick={store.tryMoveLeft}>◀</GameButton>
    <GameButton onClick={store.tryMoveDown}>▼</GameButton>
    <GameButton onClick={store.tryMoveUp}>▲</GameButton>
    <GameButton onClick={store.tryMoveRight}>▶</GameButton>
  </ButtonContainer>
);

export default Controls;
