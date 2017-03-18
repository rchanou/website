import { autorun, toJS } from "mobx";

const submitUrl = "https://qlrvsjbsr3.execute-api.us-west-2.amazonaws.com/prod/checkHumanBeforeCaptchaUpdate";

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
              alert("An error occurred.");
              console.error(responseBody);
            }
          }
        }
      } catch (ex) {
        alert(
          "An error occurred loading the levels. Refresh the page to try again"
        );
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
              alert("An error occurred.");
              console.error(responseBody);
            }
          }
        }
      } catch (ex) {
        ex => {
          alert("An error occurred.");
          console.error(ex);
        };
      }

      store.closeSubmit();
    }
  });
};

export const runGameStore = store => {
  runLevelRecordStore(store.levelRecordStore);
  runLevelEditorStore(store.editorStore);
};
