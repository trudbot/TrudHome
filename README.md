# TrudHome
trudbot's  borwser start page.

本项目的宗旨是回归浏览器起始页的本质， 只提供最基本的搜索功能。

* 无网站索引。 这是收藏夹该做的。
* 无乱七八糟的功能。 如待办/时间/天气。
* 无任何广告/宣传。 页面中没有任何链接/广告。
* 无复杂交互/动画。交互步骤少一点， 再少一点。动画？我的注意力是宝贵的!。
* 轻量。客户端渲染的体验实在太差， 本项目使用传统html/css/js分离的方法, 无运行时, 拒绝客户端js渲染首屏。

## Quick Start
web版本: 在浏览器设置中将新标签页设置为打开`https://trudbot.cn/TrudHome/`

浏览器插件版本: 
* github release下载： [`https://github.com/trudbot/TrudHome/releases/tag/latest`](`https://github.com/trudbot/TrudHome/releases/tag/latest)
* edge商店下载: [点击进入下载页面](https://microsoftedge.microsoft.com/addons/detail/trudhome/idpjijinopbhcffnlheadmkicfoeclfh?hl=zh-CN) 或者 在edge扩展商店搜索`trudhome`
* chrome商店下载: chrome开发者账号注册要5$, 因此暂不考虑chrome扩展商店发布。
* firefox商店下载: [点击进入下载页面](https://addons.mozilla.org/zh-CN/firefox/addon/trudhome/) 或者 在firefox拓展商店搜索`trudhome`

## Usage
1. 点击搜索引擎图标即可切换搜索引擎(只支持google/bing/baidu)
2. 搜索框输入时自动加载搜索建议(使用百度搜索建议)
3. 双击背景图片即可选择本地图片作为背景图片

是的， 就这点功能。

## Roadmap
* 搜索时自动在搜索词后添加` -csdn`(屏蔽csdn的结果)
    * 主要困难在于， 这功能最好作为可选， 因为有些情况可能并不希望屏蔽csdn
    * 但做成可选意味着需要增加交互点， 这违背了本项目的简洁原则。
* 历史记录。 这个功能感觉有用， 又感觉没用， 考虑中。

## Development
**install**
```shell
npm install
```
**build for web**
```shell
npm run build
```
**build for chrome extensions**
```shell
npm run build:ext
```
**build for firefox extensions**
```shell
npm run build:ext:firefox
```
