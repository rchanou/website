import React from "react";
import { autorun } from "mobx";
import { observer } from "mobx-react";

import LevelView from "./LevelView";
import Controls from "./Controls";
import KeyMap from "./KeyMap";

import { loadSokobanMap } from "../functions";

const defaultLevelMap = [
  " xxxxxxxx   ",
  " x p x  x   ",
  " x      x   ",
  " x      x   ",
  " xxxxxb x   ",
  "     x  xxx ",
  "     xb ttx ",
  "     x  xxx ",
  "     xxxx   "
];

const defaultStore = loadSokobanMap(defaultLevelMap);

const Sokoban = observer(({ store = defaultStore }) => {
  return (
    <div>
      <KeyMap
        default={console.log}
        keyMap={{
          ArrowLeft: store.tryMoveLeft,
          ArrowDown: store.tryMoveDown,
          ArrowUp: store.tryMoveUp,
          ArrowRight: store.tryMoveRight,
          e: store.tryMoveUp,
          s: store.tryMoveLeft,
          d: store.tryMoveDown,
          f: store.tryMoveRight,
          u: store.undo,
          " ": store.undo,
          Escape: store.reset
        }}
      />

      <LevelView entities={store.entities} />

      <Controls store={store} />

      <div>{store.moveCount}</div>
      <button onClick={store.undo}>Undo</button>
      <button onClick={store.reset}>Reset</button>
    </div>
  );
});

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Sokoban;
