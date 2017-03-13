import React from "react";
import { autorun, observable, createTransformer, extendObservable } from "mobx";
import { Observer } from "mobx-react";
import { sortBy } from "lodash";

import KeyMap from "./KeyMap";
import State from "./State";
import LevelView from "./LevelView";

import { getMenuStore } from "../stores";

const LevelEditor = ({ store }) => (
  <div onClick={store.goBack}>i am editor</div>
);

export default LevelEditor;
