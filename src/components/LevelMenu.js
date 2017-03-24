import React from "react";
import { observable } from "mobx";
import { Observer } from "mobx-react";
import Loading from "react-loading";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";
import DirectionMapper from "./DirectionMapper";
import { GameButton } from "./Style";
import styled from "styled-components";

import { getMenuStore } from "../stores";
import { getNextKeyInDir } from "../functions";

const creditSiteLink = "http://www.onlinespiele-sammlung.de/sokoban/sokobangames/skinner";

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

const LevelList = styled(DirectionMapper)`
  display: flex;
  flex-wrap: wrap;
`;

const LevelMenu = (
  {
    levelRecords = [],
    highlightedLevelId,
    bindClick = o => o,
    bindSelect = o => o,
    loadLevel = o => o,
    onCreateClick = o => o
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
          <KeyMap
            keyMap={{
              ArrowLeft: bindDirectionMove("x", -1),
              ArrowDown: bindDirectionMove("y", +1),
              ArrowUp: bindDirectionMove("y", -1),
              ArrowRight: bindDirectionMove("x", +1),
              Left: bindDirectionMove("x", -1),
              Down: bindDirectionMove("y", +1),
              Up: bindDirectionMove("y", -1),
              Right: bindDirectionMove("x", +1),
              Enter: () => loadLevel(highlightedLevelId)
            }}
          />

          <h2>Sokoban</h2>

          <LevelList onResize={me.handleResize}>
            {levelRecords.map(rec => (
              <LevelMenuItem
                key={rec.id}
                level={rec.level}
                highlighted={rec.id == highlightedLevelId}
                onClick={bindClick(rec.id)}
                onSelect={bindSelect(rec.id)}
              />
            ))}
          </LevelList>

          <GameButton onClick={onCreateClick}>Create</GameButton>

          <div>
            <a href={creditSiteLink} rel="noopener noreferrer" target="_blank">
              Featuring Levels Designed by David W. Skinner
            </a>

            <div>By Ron ChanOu</div>
            <div>
              Full website coming soon! Source viewable
              {" "}
              <a href="https://www.github.com/rchanou/website">here</a>.
            </div>
          </div>
        </div>
      );
    }}
  </State>
);

const ObservedLevelMenu = ({ store = getMenuStore() }) => (
  <Observer>
    {() =>
      store.levelRecordStore.state.attemptingLoad
        ? <div><Loading type="spin" color="gray" /></div>
        : <LevelMenu
            levelRecords={store.levelRecordStore.state.records}
            highlightedLevelId={store.state.highlightedLevelId}
            bindClick={id => o => store.loadLevel(id)}
            bindSelect={id => o => store.selectLevel(id)}
            loadLevel={store.loadLevel}
            onCreateClick={store.gotoCreateLevel}
          />}
  </Observer>
);

export default ObservedLevelMenu;
