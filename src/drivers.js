import { autorun } from "mobx";

const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";
const genericLevelLoadError = "An error occurred loading the levels. Refresh the page to try again.";
const genericLevelSaveError = "An error occurred trying to save the level.";

export const runLevelRecordStore = store => {
  autorun(async () => {
    if (store.state.attemptingLoad) {
      try {
        const response = await fetch(
          "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/getSokobanLevels"
        );

        if (
          response &&
          typeof response === "object" &&
          typeof response.json === "function"
        ) {
          const responseBody = await response.json();
          if (response.status === 200) {
            store.loadRecords(responseBody);
          } else {
            if (responseBody.message) {
              alert(responseBody.message);
            } else {
              alert(genericLevelLoadError);
              console.error(responseBody);
            }
          }
        }
      } catch (ex) {
        alert(genericLevelLoadError);
        console.error(ex);
      }

      store.finishLoad();
    }
  });
};

export const runLevelEditorStore = store => {
  autorun(async () => {
    const { submission } = store.state;
    if (submission) {
      try {
        const response = await fetch(submitUrl, {
          method: "POST",
          body: JSON.stringify(submission),
          headers: new Headers({ "Content-Type": "application/json" })
        });

        if (
          response &&
          typeof response === "object" &&
          typeof response.json === "function"
        ) {
          const responseBody = await response.json();
          if (response.status === 200) {
            alert("Level successfully saved!");
            store.loadLevelRecord(submission.doc);
            store.goBack();
          } else {
            if (responseBody.message) {
              alert(responseBody.message);
            } else {
              alert(genericLevelSaveError);
              console.error(responseBody);
            }
          }
        }
      } catch (ex) {
        alert(genericLevelSaveError);
        console.error(ex);
      }

      store.closeSubmit();
    }
  });
};

export const runGameStore = store => {
  runLevelRecordStore(store.levelRecordStore);
  runLevelEditorStore(store.editorStore);
};
