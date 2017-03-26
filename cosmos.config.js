module.exports = {
  componentPaths: ["src/components"],
  ignore: [/\.test.js$/],
  publicPath: "public",
  globalImports: ["assets/base.css", "assets/MyFontsWebfontsKit.css"],
  containerQuerySelector: "#root",
  webpackConfigPath: "./config/webpack.config.dev.js",
  hostname: process.env.COSMOS_HOST || "localhost"
};
