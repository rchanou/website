import React from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react";

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

const defaultStore = loadSokobanMap(defaultLevelMap);

const Sokoban = observer(({ store = defaultStore }) => (
  <div>
    <LevelView entities={store.entities} />

    <Controls store={store} />
  </div>
));

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Sokoban;
