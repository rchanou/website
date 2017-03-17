import React from "react";
import postscribe from "postscribe";
import serialize from "form-serialize";

import { GameButton } from "./Style";

//const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";

export default class Recaptcha extends React.Component {
  static defaultProps = { disabled: false, onSubmit() {} };

  saveMe = c => this.me = c;

  handleSubmit = e => {
    e.preventDefault();
    const formData = serialize(e.target, { hash: true });
    this.props.onSubmit(formData);
  };

  componentDidMount() {
    postscribe(
      this.me,
      `<script src='https://www.google.com/recaptcha/api.js'></script>`
    );
  }

  render() {
    const { disabled } = this.props;
    return (
      <div>
        <div ref={this.saveMe} />

        <form onSubmit={this.handleSubmit}>
          <div
            className="g-recaptcha"
            data-sitekey="6LfMbBgUAAAAAB2yCO4u_bdhy2RjeRLOHX4cPnys"
          />
          <GameButton type="submit" disabled={disabled}>
            {disabled ? "Saving..." : "Save"}
          </GameButton>
        </form>
      </div>
    );
  }
}
