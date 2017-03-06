import React from "react";
import { createLevelStore } from "../stores";

const Controls = ({ store = createLevelStore() }) => (
  <div>
    <button onClick={store.tryMoveLeft}>Left</button>
    <button onClick={store.tryMoveDown}>Down</button>
    <button onClick={store.tryMoveUp}>Up</button>
    <button onClick={store.tryMoveRight}>Right</button>
  </div>
);

export default Controls;
