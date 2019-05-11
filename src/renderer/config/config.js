import routes from "./router.config";
import plugins from "./plugin.config";
import chainWebpack from "./chainWebpack.config";
import getTheme from "./theme.config";
const cwd = process.cwd();
const theme = getTheme();

export default {
  history: "hash",
  outputPath: `../../dist/renderer`,
  publicPath: "./",
  plugins,
  routes,
  chainWebpack,
  theme,
};
