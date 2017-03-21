const webpack = require("webpack");
const path = require("path");

const getbaseConfig = require('./base-webpack.config.js');

const entry = "./src/app.js";

const config = Object.assign(
  getbaseConfig(), {
    entry: entry,

    output: {
      path: path.resolve(__dirname, "public"),
      filename: "app.min.js",
      publicPath: "/"
    },

    plugins: [
      new webpack.NoErrorsPlugin(),
      // builds production version of React
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
});

const compiler = webpack(config);

console.log("Started file-watching and build process. Press Ctrl+C to exit.");

compiler.plugin("compile", o => console.log("Building..."));

compiler.watch(333, (err, stats) => {
  if (stats) {
    if (stats.hasErrors()) {
      console.log(stats.toJson().errors[0]);
    } else {
      console.log(
        `Build done at ${Date()}`
      );
      console.log(`Took ${(stats.endTime - stats.startTime) / 1000} seconds.`);
    }
  }
});
