import React from "react";
import { createTransformer } from "mobx";
import { observer } from "mobx-react";
import { sortBy } from "lodash";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";
import Recaptcha from "./Recaptcha";
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

const LevelEditor = observer(({ store = getEditorStore() }) => {
  const { level, bound, editingPos } = store.state;
  const unit = 100 / bound;

  const markers = Array.from(Array(bound));
  const xLines = markers.map((_, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        pointerEvents: "none",
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
        pointerEvents: "none",
        height: "100%",
        top: 0,
        left: `${unit * i}%`,
        borderRight: "thin solid #ccc"
      }}
    />
  ));

  const editSquare = (
    <div
      style={{
        background: "aquamarine",
        pointerEvents: "none",
        position: "absolute",
        width: `${unit}%`,
        height: `${unit}%`,
        left: `${editingPos.x * unit}%`,
        top: `${editingPos.y * unit}%`
      }}
    />
  );

  return (
    <div>
      <KeyMap
        keyMap={{
          ArrowLeft: store.moveLeft,
          ArrowDown: store.moveDown,
          ArrowUp: store.moveUp,
          ArrowRight: store.moveRight,
          " ": store.placeSpace,
          a: store.placePlayer,
          w: store.placeWall,
          b: store.placeBox,
          t: store.placeTarget,
          g: store.placeBoxTarget,
          z: store.placePlayerTarget,
          Escape: store.goBack
        }}
      />

      <div style={{ maxWidth: 888 }}>
        <div style={editorStyle} onClick={store.changeFromClick}>
          {editSquare}

          {xLines}
          {yLines}

          {level.map(getEntityRenderer(level, bound))}
        </div>
        <GameButton onClick={store.goBack}>Back</GameButton>
        <Recaptcha onSubmit={store.submitLevel} />
      </div>
    </div>
  );
});

export default LevelEditor;
