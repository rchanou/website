import React from "react";
import postscribe from "postscribe";
import serialize from "form-serialize";

const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";
//const submitUrl = "https://ron.chanou.info/notyet";

export default class Scripter extends React.Component {
  saveMe = c => this.me = c;

  handleSubmit = e => {
    e.preventDefault();
    e.persist();
    //const body = new FormData(e);
    //console.log(body);
    //return;
    const body = serialize(e, { hash: true });
    console.log(body);
    fetch(submitUrl, {
      method: "POST",
      body: JSON.stringify({ what: "up" }),
      headers: new Headers({ "Content-Type": "application/json" })
    })
      .then(res => res.json())
      .then(console.log);
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

        <form
          action={submitUrl}
          method="post"
          encType="application/json"
          onSubmit={this.handleSubmit}
        >
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
