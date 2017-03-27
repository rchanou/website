import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Touch from "rc-touchable";

import KeyMap from "./KeyMap";
import Recaptcha from "./Recaptcha";
import { MainBox, ButtonContainer, GameButton } from "./Style";

import { getEditorStore } from "../stores";
import { getEntityRenderer } from "../functions";

//const cachedGetEntityRenderer = createTransformer(getEntityRenderer);

const Line = styled.div`
  position: absolute;
  pointer-events: none;
`;

const EditSquare = styled.div`
  position: absolute;
  pointer-events: none;
  background: paleturquoise;
`;

const EditorBox = styled.div`
  position: relative;
  width: 960px;
  max-width: 100vw;
  padding-top: 100%;
  background: #fafafa;
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;
`;

const LevelEditor = observer(({ store = getEditorStore() }) => {
  const { level, bound, editingPos, submission } = store.state;
  const unit = 100 / bound;

  const markers = Array.from(Array(bound));
  const xLines = markers.map((_, i) => (
    <Line
      key={i}
      style={{
        width: "100%",
        top: `${unit * i}%`,
        borderBottom: "thin solid #ccc"
      }}
    />
  ));
  const yLines = markers.map((__, i) => (
    <Line
      key={i}
      style={{
        height: "100%",
        top: 0,
        left: `${unit * i}%`,
        borderRight: "thin solid #ccc"
      }}
    />
  ));

  const editSquare = (
    <EditSquare
      style={{
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
    <MainBox>
      <Helmet>
        <title>Sokoban: Edit Puzzle</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=1"
        />
      </Helmet>

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
          Escape: confirmAndGoBack,
          Esc: confirmAndGoBack
        }}
      />

      <div>
        <Touch onPress={store.setFromPress} onLongPress={store.setPlayer}>
          <EditorBox>
            {editSquare}

            {xLines}
            {yLines}

            {level.map(getEntityRenderer(level, bound))}
          </EditorBox>
        </Touch>

        <div>
          Set cursor position with mouse or arrow keys. Place items with buttons below or keys.
        </div>

        <ButtonContainer>
          <GameButton onClick={store.placeSpace}>
            Clear Space (spacebar)
          </GameButton>
          <GameButton onClick={store.placePlayer}>Player (a)</GameButton>
          <GameButton onClick={store.placeWall}>Wall (w)</GameButton>
          <GameButton onClick={store.placeBox}>Box (b)</GameButton>
          <GameButton onClick={store.placeTarget}>Target (t)</GameButton>

          <GameButton onClick={store.placeBoxTarget}>
            Box & Target (g)
          </GameButton>
        </ButtonContainer>

        <Recaptcha onSubmit={store.submit} disabled={submission} />
      </div>
    </MainBox>
  );
});

export default LevelEditor;
