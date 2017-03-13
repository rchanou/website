import React from "react";

export default class DirectionMapper extends React.Component {
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
