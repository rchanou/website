import React from "react";
import { Observer } from "mobx-react";
import Loading from "react-loading";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";
import DirectionMapper from "./DirectionMapper";
import { MainBox } from "./Style";
import styled from "styled-components";

import { getMenuStore } from "../stores";
import { getNextKeyInDir } from "../functions";

const LevelList = styled(DirectionMapper)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const MenuItemBox = styled.div`
  width: 300px;
  height: 300px;
  padding: 20px;
  margin: 10px;

  font-size: 3.45em;
  color: #888;
  background: #fafafa;
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &.highlighted {
    background: paleturquoise;
  }
`;

const LevelMenuItem = (
  {
    level = [],
    highlighted,
    onSelect = o => o,
    onClick = o => o
  }
) => (
  <MenuItemBox onClick={onClick} className={highlighted && "highlighted"}>
    <LevelView entities={level} />
  </MenuItemBox>
);

// HACK: Used to make visible items left-aligned while keeping container centered
// no easy to do in flexbox without hacks :(
// see http://stackoverflow.com/questions/16377972/how-to-align-left-last-row-line-in-multiple-line-flexbox
const Placeholder = styled(MenuItemBox)`visibility: hidden;`;

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
      const bindDirectionMove = (axis, dir) =>
        () => {
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

          <MainBox>
            <LevelList onResize={me.handleResize}>
              {levelRecords
                .map(rec => (
                  <LevelMenuItem
                    key={rec.id}
                    level={rec.level}
                    highlighted={rec.id === highlightedLevelId}
                    onClick={bindClick(rec.id)}
                    onSelect={bindSelect(rec.id)}
                  />
                ))
                .concat(
                  <MenuItemBox
                    onClick={onCreateClick}
                    key="CREATE_LEVEL"
                    highlighted={
                      !highlightedLevelId ||
                        highlightedLevelId === "CREATE_LEVEL"
                    }
                  >
                    <div>Create</div>
                    <div>Level</div>
                  </MenuItemBox>
                )}
              <Placeholder /><Placeholder />
            </LevelList>
          </MainBox>
        </div>
      );
    }}
  </State>
);

const LoadBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const loadingEl = <LoadBox><Loading type="spin" color="gray" /></LoadBox>;

const ObservedLevelMenu = ({ store = getMenuStore() }) => (
  <Observer>
    {() =>
      store.levelRecordStore.state.attemptingLoad
        ? loadingEl
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
