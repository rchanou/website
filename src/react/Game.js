import React from "react";
import { autorun, toJS } from "mobx";

import LevelView from "./LevelView";
import loadSokobanMap from "../models";

const exampleLevelMap = [
  " xxxxxx ",
  " x   px ",
  " x * bx ",
  " x   tx ",
  " xxxxxx "
];

const levelStore = loadSokobanMap(exampleLevelMap);

class Controls extends React.Component {
  constructor(props) {
    super(props);
    const { store } = this.props;
    this.handleLeft = store.tryMove.bind(store, "x", -1);
    this.handleDown = store.tryMove.bind(store, "y", +1);
    this.handleUp = store.tryMove.bind(store, "y", -1);
    this.handleRight = store.tryMove.bind(store, "x", +1);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleLeft}>Left</button>
        <button onClick={this.handleDown}>Down</button>
        <button onClick={this.handleUp}>Up</button>
        <button onClick={this.handleRight}>Right</button>
      </div>
    );
  }
}

const Sokoban = ({ store = levelStore }) => (
  <div>
    <LevelView store={store.entities} />

    <Controls store={store} />
  </div>
);

autorun(() => console.log(levelStore.entities.map(x => x.id)));

window.serializeFocusedComponentProps = () => JSON.stringify($r.props);

export default Sokoban;
