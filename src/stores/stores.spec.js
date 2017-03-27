import { getGameStore } from "../stores";

test("getGameStore() without parameters uses defaults", () => {
  expect(getGameStore()).toMatchSnapshot();
});