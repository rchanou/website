import React from "react";
import postscribe from "postscribe";

export default class Scripter extends React.Component {
  saveMe = c => this.me = c;

  componentDidMount() {
    postscribe(
      this.me,
      `<script src='https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.26.0/aws-sdk.min.js'>
      </script><script src='https://www.google.com/recaptcha/api.js'></script>`
    );
  }

  render() {
    return <div ref={this.saveMe} />;
  }
}