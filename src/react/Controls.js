import React from "react";

const Controls = ({ store }) => (
  <div>
    <button onClick={store.tryMoveLeft}>Left</button>
    <button onClick={store.tryMoveDown}>Down</button>
    <button onClick={store.tryMoveUp}>Up</button>
    <button onClick={store.tryMoveRight}>Right</button>
  </div>
);

export default Controls;
