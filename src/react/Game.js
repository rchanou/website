import React from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react";

import LevelView from "./LevelView";
import Controls from "./Controls";
import KeyMap from "./KeyMap";

import { loadSokobanMap } from "../functions";

const defaultLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x * bx ",
  " x   tx ",
  " xxxxxx "
];

const defaultStore = loadSokobanMap(defaultLevelMap);

const Sokoban = observer(({ store = defaultStore }) => {
  const baseKeyMap = {
    ArrowLeft: store.tryMove.bind(store, "x", -1),
    ArrowDown: store.tryMove.bind(store, "y", +1),
    ArrowUp: store.tryMove.bind(store, "y", -1),
    ArrowRight: store.tryMove.bind(store, "x", +1)
  };

  return (
    <div>
      <KeyMap
        keyMap={{
          ...baseKeyMap,
          e: baseKeyMap.ArrowUp,
          s: baseKeyMap.ArrowLeft,
          d: baseKeyMap.ArrowDown,
          f: baseKeyMap.ArrowRight
        }}
        default={console.log}
      />

      <LevelView entities={store.entities} />

      <Controls store={store} />
    </div>
  );
});

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Sokoban;
