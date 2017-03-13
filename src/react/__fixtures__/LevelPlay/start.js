import { loadSokobanMap } from "../../../functions";
import { getLevelPlayStore } from "../../../stores";

const defaultLevelMap = [
  "xxxxxxxx  ",
  "x p x  x  ",
  "x      x  ",
  "x      x  ",
  "xxxxxb x  ",
  "    x  xxx",
  "    xb ttx",
  "    x  xxx",
  "    xxxx  "
];

export default {
  store: getLevelPlayStore()
  //loadSokobanMap(defaultLevelMap)
};
