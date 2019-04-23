import routes from "./router.config";
import plugins from "./plugin.config";
const cwd = process.cwd();

export default {
  history: "hash",
  outputPath: `../../dist/renderer`,
  publicPath: "./",
  plugins,
  routes,
};
