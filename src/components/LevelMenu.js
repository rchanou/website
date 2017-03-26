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

const creditSiteLink = "http://www.onlinespiele-sammlung.de/sokoban/sokobangames/skinner";

const Banner = styled.section`
  text-align: center;
  background: palevioletred;
  color: #eee;
  padding: 0.2345em;

  & h1 {
    font-size: 3em;
    font-weight: normal;
  }

  & a {
    text-decoration: none;
    color: paleturquoise;
  }
`;

const LevelList = styled(DirectionMapper)`
  display: flex;
  flex-wrap: wrap;
  @media screen and (max-width: 640px) {
    justify-content: center;
  }
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

          <Banner>
            <h1>Sokoban</h1>
            <div>
              <a
                href={creditSiteLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                Featuring Levels Designed by David W. Skinner
              </a>

              <div>By Ron ChanOu</div>
              <div>
                Full website coming soon! Source viewable
                {" "}
                <a href="https://www.github.com/rchanou/website">here</a>
              </div>
            </div>
          </Banner>

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
                  <MenuItemBox onClick={onCreateClick} key="CREATE_LEVEL">
                    <div>Create</div>
                    <div>Level</div>
                  </MenuItemBox>
                )}
            </LevelList>
          </MainBox>
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