const webpack = require("webpack");
const path = require("path");

const entry = "./src/app.js";

const config = {
  entry: entry,

  output: {
    path: path.resolve(__dirname, "public"),
    filename: "app.min.js",
    publicPath: "/"
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    // builds production version of React for performance
    /*new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),*/
    /*new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        booleans: true,
        unused: true,
        if_return: true,
        hoist_vars: true,
        join_vars: true,
        drop_console: true,
        evaluate: true,
        booleans: true,
        loops: true,
        hoist_funs: true,
        cascade: true,
        collapse_vars: true,
        reduce_vars: true,
        unsafe: true,
        conditionals: true,
        comparisons: true
      },
      output: {
        space_colon: false,
        comments: function(node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@copyright/i.test(text);
          }
        }
      }
    })*/
  ],

  resolve: {
    alias: {
      react: path.join(__dirname, "node_modules", "react") // prevent multiple React copies
    },
    extensions: [".js", ".jsx", ".css", ".es6"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      }
    ]
  }
};

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
