module.exports = {
  componentPaths: ['src/react'],
  publicPath: 'public',
  hostname: process.env.COSMOS_HOST || 'localhost',
  webpackConfigPath: 'base-webpack.config.js'
};