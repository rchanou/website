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
  const { level, bound, editingPos, submission } = store.state;
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

  const confirmAndGoBack = o => {
    const confirmed = confirm("Leave without saving?");
    if (confirmed) {
      store.goBack();
    }
  };

  return (
    <div>
      <KeyMap
        keyMap={{
          ArrowLeft: store.moveLeft,
          ArrowDown: store.moveDown,
          ArrowUp: store.moveUp,
          ArrowRight: store.moveRight,
          Left: store.moveLeft,
          Down: store.moveDown,
          Up: store.moveUp,
          Right: store.moveRight,
          " ": store.placeSpace,
          Spacebar: store.placeSpace,
          a: store.placePlayer,
          w: store.placeWall,
          b: store.placeBox,
          t: store.placeTarget,
          g: store.placeBoxTarget,
          z: store.placePlayerTarget,
          Escape: confirmAndGoBack,
          Esc: confirmAndGoBack
        }}
      />

      <div style={{ maxWidth: 888 }}>
        <div style={editorStyle} onClick={store.changeFromClick}>
          {editSquare}

          {xLines}
          {yLines}

          {level.map(getEntityRenderer(level, bound))}
        </div>

        <div>
          Set cursor position with mouse or arrow keys. Place items with buttons below or keys.
        </div>

        <div>
          <GameButton onClick={store.placeSpace}>
            Clear Space (spacebar)
          </GameButton>
          <GameButton onClick={store.placePlayer}>Player (a)</GameButton>
          <GameButton onClick={store.placeWall}>Wall (w)</GameButton>
          <GameButton onClick={store.placeBox}>Box (b)</GameButton>
          <GameButton onClick={store.placeTarget}>Target (t)</GameButton>
          <GameButton onClick={store.placePlayerTarget}>
            Player & Target (z)
          </GameButton>

          <GameButton onClick={store.placeBoxTarget}>
            Box & Target (g)
          </GameButton>

          <GameButton
            style={{ background: "tomato" }}
            onClick={confirmAndGoBack}
          >
            Back
          </GameButton>
        </div>

        <Recaptcha onSubmit={store.submit} disabled={submission} />
      </div>
    </div>
  );
});

export default LevelEditor;
