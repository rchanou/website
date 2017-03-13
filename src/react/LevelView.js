import React from "react";
import { createTransformer } from "mobx";
import { observer } from "mobx-react";
import { getEntityRenderer } from "../functions";
import { groupTypes } from "../constants";

const maxX = createTransformer(
  entities => Math.max.apply(null, entities.map(ent => ent.position.x)) + 1
);

const maxY = createTransformer(
  entities => Math.max.apply(null, entities.map(ent => ent.position.y)) + 1
);

const getUnit = createTransformer(
  entities => 100 / Math.max(maxX(entities), maxY(entities))
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

const LevelView = observer(({ entities = [] }) => {
  const unit = getUnit(entities);

  return (
    <div style={{ maxWidth: 888 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "100%"
          //background: hasWon(entities) ? "aquamarine" : "#eee"
        }}
      >
        {entities.map(getEntityRenderer(unit))}
      </div>{" "}
    </div>
  );
});

LevelView.displayName = "LevelView";

export default LevelView;
