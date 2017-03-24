import React, { PropTypes } from "react";

class State extends React.Component {
  constructor(props) {
    super(props);

    const { init } = props;

    if (typeof init === "function") {
      init(this);
    } else if (init) {
      this.state = init;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.shouldUpdate(this, nextProps, nextState);
  }

  render() {
    const { children } = this.props;
    return typeof children === "function" ? children(this) : children;
  }

  componentWillMount() {
    this.props.willMount(this);
  }

  componentDidMount() {
    this.props.onMount(this);
  }

  componentWillUpdate(nextProps, nextState) {
    this.props.willUpdate(this, nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.onUpdate(this, prevProps, prevState);
  }

  componentWillReceiveProps(nextProps) {
    this.props.willReceiveProps(this, nextProps);
  }

  componentWillUnmount() {
    this.props.willUnmount(this);
  }
}

State.defaultProps = {
  children: null,
  shouldUpdate: o => true,
  willMount() {
  },
  onMount() {
  },
  willUpdate() {
  },
  onUpdate() {
  },
  willReceiveProps() {
  },
  willUnmount() {
  }
};

State.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  init: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  initial: PropTypes.object,
  shouldUpdate: PropTypes.func,
  willMount: PropTypes.func,
  onMount: PropTypes.func,
  willUpdate: PropTypes.func,
  onUpdate: PropTypes.func,
  willReceiveProps: PropTypes.func,
  willUnmount: PropTypes.func
};

export default State;
