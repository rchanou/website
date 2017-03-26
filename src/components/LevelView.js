import React from "react";
import { observer } from "mobx-react";
import { getEntityRenderer } from "../functions";

//const cachedGetEntityRenderer = createTransformer(getEntityRenderer);

const LevelView = observer(({ entities = [] }) => {
  const renderEntities = getEntityRenderer(entities);
  return (
    <div style={{ width: "100%", maxWidth: 888 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "100%"
        }}
      >
        {entities.map(renderEntities)}
      </div>
    </div>
  );
});

LevelView.displayName = "LevelView";

export default LevelView;
