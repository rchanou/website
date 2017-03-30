import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

import { getEntityRenderer } from "../functions";

//const cachedGetEntityRenderer = createTransformer(getEntityRenderer);

const LevelViewBox = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
`;

const LevelView = observer(({ entities = [], baseHue }) => {
  const renderEntities = getEntityRenderer(entities, undefined, baseHue);
  return (
    <LevelViewBox>
      {entities.map(renderEntities)}
    </LevelViewBox>
  );
});

LevelView.displayName = "LevelView";

export default LevelView;
