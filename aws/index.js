const path = require("path");
const lambdaLocal = require("lambda-local");

const appFolder = "verify-human-and-update-level";

lambdaLocal.execute({
  event,
  lambdaPath: path.join(__dirname, appFolder, "index.js"),
  callback: function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  }
});
