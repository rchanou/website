import "babel-polyfill";
import "isomorphic-fetch";

import { getGameStore } from "../../../stores";
import { runGameStore } from "../../../drivers";

const store = getGameStore();
runGameStore(store);

export default { store };
