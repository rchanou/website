import React from "react";
import { groupTypes } from "../constants";
import { observer } from "mobx-react";

const LevelView = observer(({ entities = [], scale = 40 }) => (
  <div
    style={{
      position: "relative",
      height: 8 * scale,
      width: 8 * scale,
      background: "#eee"
    }}
  >
    {entities.map(ent => {
      const baseStyle = {
        position: "absolute",
        width: scale,
        height: scale,
        background: "gray",
        opacity: 0.8,
        transform: (
          `translateX(${ent.position.x * scale}px) translateY(${ent.position.y *
            scale}px)`
        )
      };

      let finalStyle = baseStyle;

      if (ent.group === groupTypes.player) {
        finalStyle = {
          ...baseStyle,
          background: "orange",
          borderRadius: "50%"
        };
      }

      if (ent.group === groupTypes.target) {
        finalStyle = {
          ...baseStyle,
          background: "tomato",
          borderRadius: "50%",
          transformOrigin: "50% 50%",
          transform: (
            `translateX(${ent.position.x *
              scale}px) translateY(${ent.position.y * scale}px) scale(0.5)`
          )
        };
      }

      if (ent.group === groupTypes.box) {
        finalStyle = { ...baseStyle, background: "brown" };
      }

      return <div key={ent.id} style={finalStyle} />;
    })}
  </div>
));

LevelView.displayName = "LevelView";

export default LevelView;
