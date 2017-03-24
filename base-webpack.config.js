const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.
module.exports = function () {
  return {
    context: __dirname,
    devtool: 'eval',
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    },
    externals: {
      './webpack-config.js': {
        commonjs: require.resolve(__filename)
      }
    },
    module: {
      // Using loaders instead of rules to preserve webpack 1.x compatibility
      loaders: [{
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          "presets": [
            "stage-0",
            [
              "env",
              {
                "modules": false
              }
            ],
            "react"
          ],
          "plugins": [
            "transform-runtime",
            "transform-class-properties"
          ]
        }
      }, {
        test: /\.css$/,
        loader: [require.resolve('style-loader'), require.resolve('css-loader')],
        exclude: /node_modules/,
      }],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React Cosmos',
      }),
    ],
  };
} 