import React from "react";
import postscribe from "postscribe";

//const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";
const submitUrl = "https://ron.chanou.info/notyet";

export default class Scripter extends React.Component {
  saveMe = c => this.me = c;

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

        <form action={submitUrl} method="post">
          <input name="test" />
          <div
            className="g-recaptcha"
            data-sitekey="6LfMbBgUAAAAAB2yCO4u_bdhy2RjeRLOHX4cPnys"
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
