import styled from "styled-components";

export const AppDiv = styled.div`
  max-width: 100vw;

  & * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export const MainBox = styled.main`
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    max-width: 960px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;

  & > button {
    width: 100%;
    margin: 11.11px;
  }
`;

export const GameButton = styled.button`
  background: steelblue;
  font-family: Cartwheel, Rockwell, sans-serif;
  border: none;
  color: white;
  font-size: 1.69em;
  flex-grow: 1;
  padding: 0.4em;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:disabled {
    background: gray;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export default GameButton;
