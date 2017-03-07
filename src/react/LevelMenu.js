import React from "react";
import { autorun, observable, createTransformer, extendObservable } from "mobx";
import { Observer } from "mobx-react";
import LevelView from "./LevelView";

import { createMenuStore } from "../stores";

const LevelMenuItem = ({ level, highlighted, onSelect }) => (
  <Observer>
    {o => (
      <div
        onClick={onSelect}
        style={{
          width: 200,
          height: 200,
          background: highlighted && "pink"
        }}
      >
        <LevelView entities={level} scale={20} />
      </div>
    )}
  </Observer>
);

const LevelMenu = (
  { levelRecords, highlightedLevelId, bindSelect = o => o }
) => (
  <Observer>
    {o => (
      <div>
        Menu {levelRecords.length}

        {levelRecords.map(rec => (
          <LevelMenuItem
            key={rec.id}
            level={rec.level}
            highlighted={rec.id === highlightedLevelId}
            onSelect={bindSelect(rec.id)}
          />
        ))}
      </div>
    )}
  </Observer>
);

const createLevelMenuStore = initialState => {
  const state = observable(initialState);

  return {
    state,

    selectLevel(id) {
      console.log("sel", id);
      extendObservable(state, { highlightedLevelId: id });
      //state.highlightedLevelId = id;
    }
  };
};

const defaultState = {
  highlightedLevelId: 5,
  levelRecords: [
    {
      id: 1,
      level: [
        { group: "TARGET", id: 15, position: { y: 3, x: 5 } },
        { group: "TARGET", id: 10, position: { y: 2, x: 3 } },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 0,
          position: { y: 0, x: 1 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 1,
          position: { y: 0, x: 2 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 2,
          position: { y: 0, x: 3 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 3,
          position: { y: 0, x: 4 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 4,
          position: { y: 0, x: 5 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 5,
          position: { y: 0, x: 6 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 6,
          position: { y: 1, x: 1 }
        },
        {
          isPlayer: true,
          group: "PLAYER",
          physicalType: "OBSTACLE",
          id: 7,
          position: { y: 1, x: 2 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 8,
          position: { y: 1, x: 6 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 9,
          position: { y: 2, x: 1 }
        },
        {
          group: "BOX",
          physicalType: "PUSHABLE",
          id: 11,
          position: { y: 2, x: 3 }
        },
        {
          group: "BOX",
          physicalType: "PUSHABLE",
          id: 12,
          position: { y: 2, x: 5 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 13,
          position: { y: 2, x: 6 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 14,
          position: { y: 3, x: 1 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 16,
          position: { y: 3, x: 6 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 17,
          position: { y: 4, x: 1 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 18,
          position: { y: 4, x: 2 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 19,
          position: { y: 4, x: 3 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 20,
          position: { y: 4, x: 4 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 21,
          position: { y: 4, x: 5 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 22,
          position: { y: 4, x: 6 }
        }
      ]
    },
    {
      id: 2,
      level: [
        { group: "TARGET", id: 15, position: { y: 3, x: 5 } },
        { group: "TARGET", id: 10, position: { y: 2, x: 3 } },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 0,
          position: { y: 0, x: 1 }
        },
        {
          group: "WALL",
          physicalType: "OBSTACLE",
          id: 1,
          position: { y: 0, x: 2 }
        }
      ]
    }
  ]
};

const defaultStore = createLevelMenuStore(defaultState);

autorun(o => console.log(defaultStore.state.highlightedLevelId));

const ObservedLevelMenu = ({ store = defaultStore }) => (
  <Observer>
    {o => (
      <LevelMenu
        levelRecords={store.state.levelRecords}
        highlightedLevelId={store.state.highlightedLevelId}
        bindSelect={id => o => store.selectLevel(id)}
      />
    )}
  </Observer>
);

export default ObservedLevelMenu;
