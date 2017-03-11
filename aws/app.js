const path = require("path");
const lambdaLocal = require("lambda-local");

const event = {};

lambdaLocal.execute({
  event,
  lambdaPath: path.join(__dirname, "check-captcha", "app.js"),
  callback: function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  }
});
