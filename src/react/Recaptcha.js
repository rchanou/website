import React from "react";
import postscribe from "postscribe";
import serialize from "form-serialize";
import { GameButton } from "./Style";

const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";

export default class Scripter extends React.Component {
  static defaultProps = { onSubmit() {} };

  saveMe = c => this.me = c;

  handleSubmit = e => {
    e.preventDefault();
    const formData = serialize(e.target, { hash: true });
    this.props.onSubmit(formData);
    /*formData.doc = { id: "1", level: [] };
    const body = JSON.stringify(formData);
    //console.log('form', formData, body); return;
    fetch(submitUrl, {
      method: "POST",
      body,
      headers: new Headers({ "Content-Type": "application/json" })
    })
      .then(res => res.json())
      .then(console.log);*/
  };

  componentDidMount() {
    postscribe(
      this.me,
      `<script src='https://www.google.com/recaptcha/api.js'></script>`
    );
  }

  render() {
    return (
      <div>
        <div ref={this.saveMe} />

        <form onSubmit={this.handleSubmit}>
          <div
            className="g-recaptcha"
            data-sitekey="6LfMbBgUAAAAAB2yCO4u_bdhy2RjeRLOHX4cPnys"
          />
          <GameButton>Create</GameButton>
        </form>
      </div>
    );
  }
}
