import React from "react";
import { createTransformer } from "mobx";
import { observer } from "mobx-react";
import { sortBy } from "lodash";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";
import { GameButton } from "./Style";

import { getEditorStore } from "../stores";
import { getEntityRenderer } from "../functions";

//const cachedGetEntityRenderer = createTransformer(getEntityRenderer);

const editorStyle = {
  position: "relative",
  width: "100%",
  paddingTop: "100%",
  background: "#eee"
};

const baseAxisLineStyle = {};

const LevelEditor = observer(({ store = getEditorStore() }) => {
  const { level, bound, editingPos } = store.state;
  const unit = 100 / bound;

  const markers = Array.from(Array(bound));
  const xLines = markers.map((__, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        width: "100%",
        top: `${unit * i}%`,
        borderBottom: "thin solid #ccc"
      }}
    />
  ));
  const yLines = markers.map((__, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        height: "100%",
        top: 0,
        left: `${unit * i}%`,
        borderRight: "thin solid #ccc"
      }}
    />
  ));

  const editSquare = <div 
    style={{ 
      background: 'aquamarine',
      position: 'absolute',
      width: `${unit}%`,
      height: `${unit}%`, 
      left: `${editingPos.x * unit}%`, 
      top: `${editingPos.y * unit}%`
    }}
  />;

  return (
    <div>
      <KeyMap
        keyMap={{
          ArrowLeft: store.moveLeft,
          ArrowDown: store.moveDown,
          ArrowUp: store.moveUp,
          ArrowRight: store.moveRight,
          " ": console.log,
          Enter: console.log,
          e: console.log,
          s: console.log,
          d: console.log,
          f: console.log,
          u: console.log,
          Escape: console.log
        }}
      />

      <div style={{ maxWidth: 888 }}>
        <div style={editorStyle}>
          {editSquare}

          {xLines}
          {yLines}


          {level.map(getEntityRenderer(level, bound))}
        </div>
        <GameButton onClick={store.goBack}>Back</GameButton>
      </div>
    </div>
  );
});

export default LevelEditor;
