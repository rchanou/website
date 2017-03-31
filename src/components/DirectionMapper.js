import React from "react";

export default class DirectionMapper extends React.Component {
  static defaultProps = {
    onResize() {}
  };

  static propTypes = {
    onResize: React.PropTypes.func
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
      let positions = [];
      for (let i in kids) {
        i = Number(i);
        const kid = kids[i];

        if (!kid) {
          continue;
        }

        if (kid.dataset && kid.dataset.skip) {
          continue;
        }

        const child = children[i];
        if (!child) {
          continue;
        }

        positions.push({
          x: (kid.offsetLeft - xOrigin) / xUnit,
          y: (kid.offsetTop - yOrigin) / yUnit,
          key: child.key
        });
      }
      this.props.onResize(positions);
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
