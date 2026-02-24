fabritor-web 图片编辑器
---

## 修改版

添加功能：
1. 素材-添加了更多的形状
2. 选项区域把【位置】选项放出来了，无需多点一次
3. 左侧菜单-新增【Json】，可以直接看到json，可以在这里直接修改json来快速调整
4. 暴露全局api能力，


### Json
新增了一个json菜单，可以直接看到json，也可以通过修改json来精准修改

### 全局API
可以通过 `window.fabritor.canvas.getObjects()` 来获取所有对象  
方便AI通过 浏览器mcp 来快速修改，比如一键对齐 


### ARIA
增强可访问性

利用ARIA属性让AI agent理解UI结构：

```xml
  <button
    aria-label="Left align text objects"
    data-testid="fabritor-btn-align-left"
  >
  </button>
```


## 以下是原版

<p align="center"><img alt="logo" src="/public/logo.svg"></p>

<p align="center">
  <strong>👻 fabritor, A creative editor based on fabricjs</strong><br/>
  <strong>😘 快速构建属于自己的图片编辑器</strong>
</p>

<p align="center"><img alt="banner" src="/public/fabritor_2024_1.png"></p>

### 🔥 文档

<strong>正在编写 [fabritor 手册](https://sleepy-zone.github.io/fabritor-handbook)，跟着 faritor 一起学习 fabric.js</strong>

手册内覆盖几乎所有的 fabritor 特性，也是一本 fabric.js 学习手册！

### 👻 特性

使用 fabritor，快速构建属于自己的图片编辑器。

在线体验：[https://fabritor.surge.sh/](https://fabritor.surge.sh/)

<p align="center"><img alt="banner" src="/public/fabritor_editor.png"></p>

**📚 文本** 内置多种开源字体；支持调整文字样式；支持多种文字特效：描边、阴影、形状文字、文字渐变、文字填充。

**🌄 图片** 加载本地或者远程图片；支持图片边框和圆角；支持图片裁剪；支持多种图片滤镜；

**➡️ 形状** 支持线段、箭头和多边形；多边形支持添加边框，同样支持渐变填充。支持手绘风格图形。

**✍️ 画笔** 支持自由绘制

**💎 应用** 二维码、emoji

**👚 画布** 支持定制背景色和画布尺寸；支持画布拖拽。

**🛒 元素操作** 锁定、透明度、组合、复制粘贴、删除、图层层级、历史操作记录、页面对齐及对应的快捷键操作。

**🛠 导出** 导出到剪贴板，导出 JPG、PNG、SVG 和模板（JSON），基于 JSON 可以构建模板库。

**安全可靠** 纯浏览器端操作；操作自动保存到本地，数据不丢失。

**多语言支持** 支持中英文切换

### 本地开发

```bash
npm install -g yarn
yarn
yarn start
```

访问: http://localhost:3000

### 哪些项目在使用 fabritor

#### 截图美化工具

[https://www.photor.fun/](https://www.photor.fun/)

<p align="center"><img alt="photor" src="/public/photor.png"></p>

欢迎提交自己的作品或者项目。
