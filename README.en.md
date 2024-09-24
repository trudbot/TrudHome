# TrudHome
trudbot's browser start page.

The purpose of this project is to return to the essence of the browser start page, providing only the most basic search functionality.

* No website index. That's what bookmarks are for.
* No miscellaneous features. Such as to-do lists, time, weather.
* No ads or promotions. No links or ads on the page.
* No complex interactions or animations. Fewer interaction steps, and even fewer. Animations? My attention is precious!
* Lightweight. The client-side rendering experience is really poor. This project uses the traditional method of separating HTML/CSS/JS, with no runtime and no client-side JS rendering for the first screen.

## Quick Start
Web version: Set the new tab page in your browser settings to open `https://trudbot.cn/TrudHome/`

Browser extension version:
* Download from GitHub release: `https://github.com/trudbot/TrudHome/releases/tag/latest`
* Download from Edge store: Edge extension is being published;
* Download from Chrome store: Chrome developer account registration costs $5, so Chrome release is not considered for now.

## Usage
1. Click the search engine icon to switch search engines (only supports Google/Bing/Baidu)
2. Search suggestions are automatically loaded when typing in the search box (using Baidu search suggestions)
3. Double-click the background image to select a local image as the background

Yes, that's all the functionality.

## Roadmap
* Automatically add ` -csdn` to search terms when searching (to block CSDN results)
    * The main difficulty is that this feature is best made optional, as there are situations where you might not want to block CSDN
    * But making it optional means adding interaction points, which goes against the simplicity principle of this project.
* History records. This feature seems useful, but also seems unnecessary. Under consideration.

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
