import React, { PropTypes } from "react";

class KeyMap extends React.Component {
  static propTypes = {
    keyMap: PropTypes.objectOf(PropTypes.func),
    children: PropTypes.node
  }

  static defaultProps = {
    keyMap: {},
    children: null
  };

  handleKeyDown = e => {
    const handler = this.props.keyMap[e.key];
    if (handler) {
      e.preventDefault();
      handler(e);
    } else if (this.props.default) {
      this.props.default(e);
    }
  };

  componentDidMount() {
    document.onkeydown = this.handleKeyDown;
  }

  render() {
    return this.props.children;
  }

  componentWillUnmount() {
    if (document.onkeydown === this.handleKeyDown) {
      document.onkeydown = null;
    }
  }
}

export default KeyMap;
