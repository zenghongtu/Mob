export default [
  [
    "umi-plugin-react",
    {
      antd: true,
      dva: true,
      dynamicImport: true,
      title: "umi-electron-typescript",
      dll: true,
      hardSource: false,
      routes: {
        exclude: [/components\//],
      },
      locale: {
        default: "zh-CN",
        baseNavigator: false,
        antd: true,
      },
    },
  ],
];
