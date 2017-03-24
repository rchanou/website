module.exports = {
  componentPaths: ["src/components"],
  ignore: [/\.test.js$/],
  globalImports: ["assets/base.css", "assets/MyFontsWebfontsKit.css"],
  containerQuerySelector: "#root",
  webpackConfigPath: "react-scripts/config/webpack.config.dev"
};
