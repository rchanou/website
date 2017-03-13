import React from "react";
import { observable } from "mobx";
import { Observer } from "mobx-react";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";
import DirectionMapper from "./DirectionMapper";

import { getMenuStore } from "../stores";
import { getNextKeyInDir } from "../functions";

const LevelMenuItem = (
  { level = [], highlighted, onSelect = o => o, onClick = o => o }
) => (
  <div
    onClick={onClick}
    style={{
      width: 200,
      height: 200,
      background: highlighted && "pink",
      padding: 10
    }}
  >
    <LevelView entities={level} />
  </div>
);

const LevelMenu = (
  {
    levelRecords = [],
    highlightedLevelId,
    bindClick = o => o,
    bindSelect = o => o,
    loadLevel = o => o
  }
) => (
  <State
    init={me => {
      me.state = { positions: [] };
      me.handleResize = ps => me.setState({ positions: ps });
    }}
  >
    {me => {
      const bindDirectionMove = (axis, dir) => {
        const crossAxis = axis == "x" ? "y" : "x";
        return () => {
          if (highlightedLevelId === -1) {
            bindSelect(levelRecords[0].id)();
          } else {
            const { positions } = me.state;
            const nextKey = getNextKeyInDir(
              positions,
              highlightedLevelId,
              axis,
              dir
            );
            bindSelect(nextKey)();
          }
        };
      };

      return (
        <div>
          Menu

          <KeyMap
            keyMap={{
              ArrowLeft: bindDirectionMove("x", -1),
              ArrowDown: bindDirectionMove("y", +1),
              ArrowUp: bindDirectionMove("y", -1),
              ArrowRight: bindDirectionMove("x", +1),
              Enter: () => loadLevel(highlightedLevelId),
              e: console.log,
              s: console.log,
              d: console.log,
              f: console.log,
              u: console.log,
              " ": console.log,
              Escape: console.log
            }}
          />

          <DirectionMapper
            style={{ display: "flex", flexWrap: "wrap" }}
            onResize={me.handleResize}
          >
            {levelRecords.map(rec => (
              <LevelMenuItem
                key={rec.id}
                level={rec.level}
                highlighted={rec.id == highlightedLevelId}
                onClick={bindClick(rec.id)}
                onSelect={bindSelect(rec.id)}
              />
            ))}
          </DirectionMapper>
        </div>
      );
    }}
  </State>
);

const getLoadLevelAction = menuStore => id => {};

const ObservedLevelMenu = ({ store = getMenuStore() }) => (
  <Observer>
    {o => (
      <LevelMenu
        levelRecords={store.levelRecordStore.state.records}
        highlightedLevelId={store.state.highlightedLevelId}
        bindClick={id => o => store.loadLevel(id)}
        bindSelect={id => o => store.selectLevel(id)}
        loadLevel={store.loadLevel}
      />
    )}
  </Observer>
);

export default ObservedLevelMenu;
