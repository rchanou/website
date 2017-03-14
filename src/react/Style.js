import styled from "styled-components";

export const ButtonContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 610px;
  margin: -5px;
`;

export const GameButton = styled.button`
  background: steelblue;
  border-radius: 11.1px;
  border: none;
  color: white;
  font-size: 2.22em;
  flex-grow: 1;
  padding: 0.4em;
  margin: 5px;

  &:disabled {
    background: gray;
  }
`;

export default GameButton;