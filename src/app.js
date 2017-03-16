import "babel-polyfill";
import "isomorphic-fetch";
import React from "react";
import ReactDOM from "react-dom";
import App from "./react/Game";

ReactDOM.render(<App />, document.getElementById("root"));
