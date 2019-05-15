import path from "path";
import MergeLessPlugin from "antd-pro-merge-less";
import AntDesignThemePlugin from "antd-theme-webpack-plugin";

const rootPath = path.join(__dirname, "../../../");
const rendererPath = path.join(rootPath, "src/renderer");

export default config => {
  config.target("electron-renderer");
  const outFile = path.join(rendererPath, ".temp/mob-style.less");
  const stylesDir = path.join(rendererPath, "themes");

  config.plugin("merge-less").use(MergeLessPlugin, [
    {
      stylesDir,
      outFile,
    },
  ]);

  config.plugin("ant-design-theme").use(AntDesignThemePlugin, [
    {
      antDir: path.join(rootPath, "node_modules/antd"),
      stylesDir,
      varFile: path.join(
        rootPath,
        "node_modules/antd/lib/style/themes/default.less",
      ),
      mainLessFile: outFile, //     themeVariables: ['@primary-color'],
      indexFileName: "index.html",
      generateOne: true,
      lessUrl: "https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js",
    },
  ]);
};
