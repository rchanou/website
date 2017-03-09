import React from "react";
import { autorun, observable, createTransformer, extendObservable } from "mobx";
import { Observer } from "mobx-react";
import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";

import { createMenuStore } from "../stores";

class DirectionMapper extends React.Component {
  static defaultProps = {
    onResize: o => o
  };

  saveMe = c => this.me = c;

  calculateMap = () => {
    if (this.calculating) {
      return;
    }

    this.calculating = true;

    requestAnimationFrame(() => {
      const firstKid = this.me.children[0];
      const xUnit = firstKid.offsetWidth;
      const yUnit = firstKid.offsetHeight;
      const xOrigin = firstKid.offsetLeft;
      const yOrigin = firstKid.offsetTop;

      //console.log(this.props.children);

      let positions = [];
      const kids = this.me.children;
      for (let i in kids) {
        i = Number(i);
        const kid = kids[i];

        if (!kid) {
          continue;
        }

        positions.push({
          x: (kid.offsetLeft - xOrigin) / xUnit,
          y: (kid.offsetTop - yOrigin) / yUnit,
          key: this.props.children[i].key
        });
      }
      this.props.onResize(positions);
      console.log(JSON.stringify(positions));
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

const LevelMenuItem = ({ level = [], highlighted, onSelect = o => o }) => (
  <div
    onClick={onSelect}
    style={{
      width: 200,
      height: 200,
      background: highlighted && "pink",
      padding: 10
    }}
  >
    <LevelView entities={level} scale={20} />
  </div>
);

const LevelMenu = (
  { levelRecords = [], highlightedLevelId, bindSelect = o => o }
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
            const currentPos = positions.find(p => p.key == highlightedLevelId);
            let newPos = positions.find(
              p =>
                p[crossAxis] === currentPos[crossAxis] &&
                p[axis] === currentPos[axis] + dir
            );
            if (!newPos) {
              const axisMax = Math.max.apply(0, positions.map(p => p[axis]));
              const crossAxisLength = Math.max.apply(
                0,
                positions.map(p => p[crossAxis])
              ) + 1;
              const wrapPos = {
                [axis]: dir > 0 ? 0 : axisMax,
                [crossAxis]: (currentPos[crossAxis] + dir) % crossAxisLength
              };
              newPos = positions.find(
                p =>
                  p[axis] === wrapPos[axis] &&
                  p[crossAxis] === wrapPos[crossAxis]
              );
            }
            bindSelect(newPos.key)();
          }
        };
      };

      return (
        <div>
          Menu {levelRecords.length}

          <KeyMap
            keyMap={{
              ArrowLeft: bindDirectionMove("x", -1),
              ArrowDown: bindDirectionMove("y", +1),
              ArrowUp: bindDirectionMove("y", -1),
              ArrowRight: bindDirectionMove("x", +1),
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
                onSelect={bindSelect(rec.id)}
              />
            ))}
          </DirectionMapper>
        </div>
      );
    }}
  </State>
);

//console.log(LevelMenuItem, <LevelMenuItem key="poop" />);

const createLevelMenuStore = initialState => {
  const state = observable(initialState);

  return {
    state,

    selectLevel(id) {
      state.highlightedLevelId = id == state.highlightedLevelId ? -1 : id;
    }
  };
};

const baseLevel = [
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
];
/* {
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
  };*/

const defaultState = {
  highlightedLevelId: -1,
  levelRecords: [
    { id: 0, level: baseLevel },
    ...[1, 2, 3, 4, 5, 6, 7].map(x => ({
      id: x,
      level: baseLevel.filter(o => Math.random() < 0.5)
    })),
    { id: 8, level: baseLevel.filter(ent => ent.position.x < 3) },
    { id: 9, level: baseLevel.filter(ent => ent.position.y < 3) }
  ]
};

const defaultStore = createLevelMenuStore(defaultState);

//autorun(o => console.log(defaultStore.state.highlightedLevelId));

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
