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

const LevelView = observer(({ entities = [], scale = 40 }) => (
  <div style={{ position: "relative" }}>
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
