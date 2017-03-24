import "babel-polyfill";
import "isomorphic-fetch";
import React from "react";
import ReactDOM from "react-dom";

import { getGameStore } from "./stores";
import { runGameStore } from "./drivers";
import App from "./components/Game";
import "../assets/base.css";
import "../public/MyFontsWebfontsKit.css";

const initialStore = getGameStore();
runGameStore(initialStore);

ReactDOM.render(<App store={initialStore} />, document.getElementById("root"));
