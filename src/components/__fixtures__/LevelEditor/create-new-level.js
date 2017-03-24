import { getEditorStore } from "../../../stores";
import { runLevelEditorStore } from "../../../drivers";

const store = getEditorStore();
runLevelEditorStore(store);

export default { store };
