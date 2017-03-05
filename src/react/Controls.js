import React from "react";

class Controls extends React.Component {
  static defaultProps = {
    store: {
      tryMove(){}
    }
  }

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

export default Controls;
