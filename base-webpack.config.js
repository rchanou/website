const HtmlWebpackPlugin = require('html-webpack-plugin');

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.

module.exports = function () {
  return {
    devtool: 'eval',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      // Using loaders instead of rules to preserve webpack 1.x compatibility
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            "presets": [
              "react",
              "stage-0",
              [
                "env",
                {
                  "modules": false
                }
              ]
            ],
            "plugins": [
              "transform-runtime",
              "transform-class-properties"
            ]
          }
        }]
      }, {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')]
      }, {
        test: /\.(eot|woff|ttf|svg|otf|png|jpg|jpeg)/,
        use: require.resolve('url-loader')
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React Cosmos'
      })
    ]
  };
};