import React from "react";
import { autorun, observable, createTransformer, extendObservable } from "mobx";
import { Observer } from "mobx-react";
import { sortBy } from "lodash";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";

import { getMenuStore } from "../stores";

class DirectionMapper extends React.Component {
  static defaultProps = {
    onResize: o => o
  };

  saveMe = c => this.me = c;

  calculateMap = () => {
    const { children } = this.props;

    if (!children || !children.length) {
      return;
    }

    if (this.calculating) {
      return;
    }

    this.calculating = true;

    requestAnimationFrame(() => {
      const kids = this.me.children;
      const firstKid = kids[0];
      const xUnit = firstKid.offsetWidth;
      const yUnit = firstKid.offsetHeight;
      const xOrigin = firstKid.offsetLeft;
      const yOrigin = firstKid.offsetTop;
      //console.log(this.props.children);
      let positions = [];
      for (let i in kids) {
        i = Number(i);
        const kid = kids[i];

        if (!kid) {
          continue;
        }

        positions.push({
          x: (kid.offsetLeft - xOrigin) / xUnit,
          y: (kid.offsetTop - yOrigin) / yUnit,
          key: children[i].key
        });
      }
      this.props.onResize(positions);
      //console.log(JSON.stringify(positions));
      this.calculating = false;
    });
  };

  componentDidMount() {
    this.calculateMap();
    this.listener = window.addEventListener("resize", this.calculateMap);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateMap);
  }

  render() {
    const { children, onResize, ...other } = this.props;
    return (
      <div ref={this.saveMe} {...other}>
        {children}
      </div>
    );
  }
}

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

const getNextKeyInDir = (positions, currentPosKey, axis, dir) => {
  const crossAxis = axis == "x" ? "y" : "x";
  const sortedPositions = sortBy(positions, [crossAxis, axis]);
  const currentPosIndex = sortedPositions.findIndex(
    p => p.key == currentPosKey
  );
  let nextPosIndex = currentPosIndex + dir;
  if (nextPosIndex < 0) {
    nextPosIndex = positions.length - 1;
  } else if (nextPosIndex > positions.length - 1) {
    nextPosIndex = 0;
  }
  return sortedPositions[nextPosIndex].key;
};

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
