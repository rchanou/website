import React from "react";
import { groupTypes } from "../constants";
import { observer } from "mobx-react";
import { Motion, spring } from "react-motion";

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
        opacity: 0.8
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
          transformOrigin: "50% 50%"
        };
      }
      if (ent.group === groupTypes.box) {
        finalStyle = { ...baseStyle, background: "brown" };
      }

      return (
        <Motion
          key={ent.id}
          style={{ x: spring(ent.position.x), y: spring(ent.position.y) }}
        >
          {({ x, y }) => {
            const baseTransform = `
              translateX(${x * scale}px) translateY(${y * scale}px)
            `;

            return (
              <div
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
          }}
        </Motion>
      );
    })}
  </div>
));

LevelView.displayName = "LevelView";

export default LevelView;
