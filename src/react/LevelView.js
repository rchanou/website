import React from "react";
import { createTransformer } from "mobx";
import { observer } from "mobx-react";
import { getEntityRenderer } from "../functions";
import { groupTypes } from "../constants";

//const cachedGetEntityRenderer = createTransformer(getEntityRenderer);

const LevelView = observer(({ entities = [] }) => {
  return (
    <div style={{ maxWidth: 888 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "100%"
        }}
      >
        {entities.map(getEntityRenderer(entities))}
      </div>
    </div>
  );
});

LevelView.displayName = "LevelView";

export default LevelView;
