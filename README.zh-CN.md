# umi-electron-typescript

### 一个基于umijs + electron + typescript的模板

[![Umi](https://img.souche.com/f2e/a92fc3dfdb4918578861c42bbfcfaf7f.png)](https://umijs.org/)
[![Webpack](https://img.souche.com/f2e/cdc96229f3f9b7068a9b13f7658a9b0e.png)](https://webpack.js.org/)
[![TypeScript](https://img.souche.com/f2e/abaffc28828246dcca08eae82a0b34c3.png)](https://www.typescriptlang.org/)
[![Electron](https://img.souche.com/f2e/4f18b23a82d106ce023cdaf17c6dfd51.png)](https://electronjs.org/)

## 主要特性
- 支持整个应用的热重载
- 支持typescript语法

## 安装

首先通过git下载这个仓库到本地

```javascript
  git clone git@github.com:wangtianlun/umi-electron-typescript.git
```

然后通过yarn下载依赖

```javascript
  $ yarn
```

## 开发

首先通过以下命令启动渲染进程(默认端口：8000)

```javascript
  $ yarn start:renderer
```

然后启动主进程

```javascript
  $ yarn start:main
```

## 打包

```javascript
  $ npm run pack
```

如果想把代码打包成一个dmg文件或者zip文件，可以执行以下命令

```javascript
  $ npm run dist
```

## 应用截图

![umi-electron-typescript-image](https://img.souche.com/f2e/f26a29f3232f33dfa1ade9b48df64b6b.png)

