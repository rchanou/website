import React from "react";

class KeyMap extends React.Component {
  static defaultProps = {
    keyMap: {},
    children: null
  };

  handleKeyDown = e => {
    const handler = this.props.keyMap[e.key];
    if (handler) {
      handler(e);
    } else if (this.props.default) {
      this.props.default(e);
    }
  };

  componentDidMount() {
    document.onkeydown = this.handleKeyDown;
  }

  render() {
    const { keyMap, children } = this.props;
    return children;
  }

  componentWillUnmount() {
    if (document.onkeydown === this.handleKeyDown) {
      document.onkeydown = null;
    }
  }
}

export default KeyMap;
