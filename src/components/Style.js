import styled from "styled-components";

export const AppDiv = styled.div`
  background: #eee;

  & * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export const MainBox = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * {
    max-width: 960px;
  }
`;

export const FullDiv = styled.div`
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;

  & > button {
    width: calc(50% - 11.10px);
    margin: 5.55px;
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