import { getMin, compactPuzzle } from "../functions";
import { input, output } from "./__test__/puzzle-to-compact";

test("getMin gets non-zero min x for non-compact puzzle", () => {
  expect(getMin("x", input)).toBe(1);
});

test("getMin gets zero min y for puzzle flush to top", () => {
  expect(getMin("y", input)).toBe(0);
});

test("compactPuzzle compacts puzzle with leading empty space", () => {
  expect(compactPuzzle(input)).toEqual(output);
});
