import React from "react";

import LevelView from "./LevelView";
import Controls from "./Controls";

import { loadSokobanMap } from "../functions";

const defaultLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x * bx ",
  " x   tx ",
  " xxxxxx "
];

const Sokoban = ({ store = loadSokobanMap(defaultLevelMap) }) => (
  <div>
    <LevelView entities={store.entities} />

    <Controls store={store} />
  </div>
);

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Sokoban;
