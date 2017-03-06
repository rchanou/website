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

const LevelView = observer(({ entities = [], scale = 40 }) => (
  <div
    style={{
      position: "relative",
      height: maxY(entities) * scale,
      width: maxX(entities) * scale,
      background: hasWon(entities)? "aquamarine": "#eee"
    }}
  >
    {entities.map(ent => {
      const startStyle = {
        ...baseEntityStyle,
        width: scale,
        height: scale
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
          transformOrigin: "50% 50%"
        };
      }
      if (ent.group === groupTypes.box) {
        finalStyle = { ...startStyle, background: "brown" };
      }

      const baseTransform = `
        translateX(${ent.position.x * scale}px) 
        translateY(${ent.position.y * scale}px)
      `;

      return (
        <div
          key={ent.id}
          style={{
            ...finalStyle,
            transform: (
              ent.group === groupTypes.target
                ? `${baseTransform} scale(0.5)`
                : baseTransform
            )
          }}
        />
      );
    })}
  </div>
));

LevelView.displayName = "LevelView";

export default LevelView;
