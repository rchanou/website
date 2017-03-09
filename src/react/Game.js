import React from "react";
import { autorun, createTransformer } from "mobx";
import { observer, Observer } from "mobx-react";

import LevelView from "./LevelView";
import Controls from "./Controls";
import KeyMap from "./KeyMap";

import { groupTypes } from "../constants";

const maxX = createTransformer(
  entities => Math.max.apply(null, entities.map(ent => ent.position.x)) + 1
);

const maxY = createTransformer(
  entities => Math.max.apply(null, entities.map(ent => ent.position.y)) + 1
);

const hasWon = createTransformer(entities => {
  const targets = entities.filter(ent => ent.group === groupTypes.target);
  const boxes = entities.filter(ent => ent.group === groupTypes.box);
  for (const target of targets) {
    const targetPos = target.position;
    if (
      !boxes.find(
        box => box.position.x === targetPos.x && box.position.y === targetPos.y
      )
    ) {
      return false;
    }
  }
  return true;
});

const Game = observer(({ store, scale = 40 }) => (
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

    <div
      style={{
        background: hasWon(store.state.entities) ? "aquamarine" : "#eee",
        height: maxY(store.state.entities) * scale,
        width: maxX(store.state.entities) * scale
      }}
    >
      <LevelView entities={store.state.entities} scale={scale} />
    </div>

    <Controls store={store} />
    <div>{store.state.moveCount}</div>
    <button onClick={store.undo}>Undo</button>
    <button onClick={store.reset}>Reset</button>
  </div>
));

Game.displayName = "Game";

//autorun(o => console.log(defaultStore.entities));

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Game;
