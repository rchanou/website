import React from "react";
import { groupTypes } from "../constants";
import { createTransformer } from "mobx";
import { observer } from "mobx-react";

const baseEntityStyle = {
  position: "absolute",
  opacity: 0.8,
  transition: "0.2s",
  background: "gray"
};

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
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        background: hasWon(entities) ? "aquamarine" : "#eee"
      }}
    >
      {entities.map(ent => {
        const startStyle = {
          ...baseEntityStyle,
          width: `${unit}%`,
          height: `${unit}%`,
          top: `${ent.position.y * unit}%`,
          left: `${ent.position.x * unit}%`
        };

        let finalStyle = startStyle;
        if (ent.group === groupTypes.player) {
          finalStyle = {
            ...startStyle,
            background: "orange",
            borderRadius: "50%"
          };
        }
        if (ent.group === groupTypes.target) {
          finalStyle = {
            ...startStyle,
            background: "tomato",
            borderRadius: "50%",
            transformOrigin: "50% 50%",
            transform: "scale(0.5)"
          };
        }
        if (ent.group === groupTypes.box) {
          finalStyle = { ...startStyle, background: "brown" };
        }

        return <div key={ent.id} style={finalStyle} />;
      })}
    </div>
  );
});

LevelView.displayName = "LevelView";

export default LevelView;
