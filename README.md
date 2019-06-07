<img src="https://github.com/zenghongtu/Mob/blob/master/build/icons/128x128.png" />

> Mob(モブ), [异能超能 100](https://www.bilibili.com/bangumi/media/md5058)的男一号（强烈推荐此番 👍）

【[English README](https://github.com/zenghongtu/Mob/blob/master/README.en.md)】

[![Current Release](https://img.shields.io/github/release/zenghongtu/Mob.svg?style=flat-square)](https://github.com/zenghongtu/Mob/releases)
![License](https://img.shields.io/github/license/zenghongtu/Mob.svg?style=flat-square)
[![Build Status](https://travis-ci.org/zenghongtu/Mob.svg?branch=master)](https://travis-ci.org/zenghongtu/Mob) [](https://camo.githubusercontent.com/367dc8fdf5ea8444dd116c43c7900d9a1b1e9862/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f7472617a796e2f69656173654d757369632e7376673f7374796c653d666c61742d737175617265)

> 基于 [Electron](https://github.com/electron/electron), [Umi](https://github.com/umijs/umi), [Dva](https://github.com/dvajs/dva), [Antd](https://github.com/ant-design/ant-design) 构建

## 预览

![](images/mob-preview.gif)

## 截图

### Mac

![](images/2019-05-12-23-50-45.png)
![](images/2019-05-12-23-50-58.png)
![](images/2019-05-13-00-26-40.png)
![](images/2019-05-13-00-27-08.png)
![](images/2019-05-15-15-23-36.png)

v0.2.0 以上：

![](images/2019-05-16-22-25-41.png)

### Linux

![](images/2019-05-13-19-05-12.png)

### Win

![](images/2019-05-13-19-07-26.png)

## 功能

- [x] 一个基本的音乐播放器
- [x] 每日必听
- [x] 推荐
- [x] 排行榜
- [x] 分类
- [x] 订阅
- [x] 听过
- [x] 下载声音
- [x] 搜索专辑
- [x] 快捷键设置
- [x] 颜色设置
- [x] 背景图片设置

## 更多功能

- [ ] 加入 [Himalaya podcast](https://www.himalaya.com/) 接口
- [ ] 多语言
- [ ] 下载历史
- [ ] 本地音乐
- [ ] 播放记录
- [ ] 专辑评论
- [ ] 多个声音加入播放列表

## 安装

[**这里**](https://github.com/zenghongtu/Mob/releases/latest) 去下载最新版本，或者下面的指定系统版本。

### Mac(10.9+)

[下载](https://github.com/zenghongtu/Mob/releases/download/v0.2.2/Mob-0.2.2-mac.dmg) `.dmg` 或者使用 `homebrew`:

```
brew cask install mob
```

### Linux

'Debian / Ubuntu' 使用 `.deb` [下载](https://github.com/zenghongtu/Mob/releases/download/v0.2.2/Mob-0.2.2-linux-amd64.deb):

```
$ sudo dpkg -i Mob-0.2.2-linux-amd64.deb
```

其他发行版本用 `.Appimage` [下载](https://github.com/zenghongtu/Mob/releases/download/v0.2.2/Mob-0.2.2-linux-x86_64.AppImage):

```
$ chmod u+x Mob-0.2.2-linux-x86_64.AppImage
$ ./Mob-0.2.2-linux-x86_64.AppImage
```

### Win

[下载](https://github.com/zenghongtu/Mob/releases/download/v0.2.2/Mob-Setup-0.2.2.exe)

## 默认快捷键

### 全局

| 描述        | 按键                                                               |
| ----------- | ------------------------------------------------------------------ |
| 暂停 / 播放 | <kbd>Cmd / Ctrl</kbd> + <kbd>Option / Alt</kbd> + <kbd>S</kbd>     |
| 音量加      | <kbd>Cmd / Ctrl</kbd> + <kbd>Option / Alt</kbd> + <kbd>Up</kbd>    |
| 音量减      | <kbd>Cmd / Ctrl</kbd> + <kbd>Option / Alt</kbd> + <kbd>Down</kbd>  |
| 上一曲      | <kbd>Cmd / Ctrl</kbd> + <kbd>Option / Alt</kbd> + <kbd>Left</kbd>  |
| 下一曲      | <kbd>Cmd / Ctrl</kbd> + <kbd>Option / Alt</kbd> + <kbd>Right</kbd> |

支持媒体键（OS X 10.13 以上需要请求授权）

## 开发

```
$ yarn install
$ yarn run start:main
$ yarn run start:renderer
```

## 欢迎参与贡献

发现了错误? 向我发起一个 [PR](https://github.com/zenghongtu/Mob/pulls) 吧!
参考 [Commit message 和 Change log 编写指南 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html) 提交 commit 即可。

## 致谢

- [@yinxin630](https://github.com/yinxin630)添加了媒体快捷键的支持。
- [@wangtianlun](https://github.com/wangtianlun)提供的模板([umi-electron-typescript](https://github.com/wangtianlun/umi-electron-typescript))，我是在这个模板上进行修改的。
- [Electron](https://github.com/electron/electron), [Umi](https://github.com/umijs/umi), [Dva](https://github.com/dvajs/dva), [Antd](https://github.com/ant-design/ant-design)等框架的开发者们，开发了这么多非常棒的工具。

最后要感谢 [有声小说,听小说,有声书,在线听书电台-喜马拉雅 FM](https://www.ximalaya.com/) 提供丰富的资源，听音乐、听力还有段子全都靠它啦~

## 技术交流

![](images/2019-05-29-19-06-34.png)

## 协议

MIT © [zenghongtu](https://github.com/zenghongtu)
