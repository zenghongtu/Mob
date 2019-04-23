# umi-electron-typescript

### An example based on umijs + electron + typescript

[![Umi](https://img.souche.com/f2e/a92fc3dfdb4918578861c42bbfcfaf7f.png)](https://umijs.org/)
[![Webpack](https://img.souche.com/f2e/cdc96229f3f9b7068a9b13f7658a9b0e.png)](https://webpack.js.org/)
[![TypeScript](https://img.souche.com/f2e/abaffc28828246dcca08eae82a0b34c3.png)](https://www.typescriptlang.org/)
[![Electron](https://img.souche.com/f2e/4f18b23a82d106ce023cdaf17c6dfd51.png)](https://electronjs.org/)

[访问中文版](https://github.com/wangtianlun/umi-electron-typescript/blob/master/README.zh-CN.md)

## Features
- Support hot reload for main process and renderer process
- Support typescript

## Install

First, clone the repo via git:

```javascript
  git clone git@github.com:wangtianlun/umi-electron-typescript.git
```

And then install the dependencies with yarn

```javascript
  $ yarn
```

## Starting Development

First, start the renderer process (default port 8000)

```javascript
  $ yarn start:renderer
```

And then start the main process

```javascript
  $ yarn start:main
```

## Packaging

```javascript
  $ npm run pack
```

If you want to package into dmg(on mac) or zip, you can follow below

```javascript
  $ npm run dist
```

## screenshot

![umi-electron-typescript-image](https://img.souche.com/f2e/f26a29f3232f33dfa1ade9b48df64b6b.png)

