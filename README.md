# MCFunction 语法高亮工具使用指南 | MCFunction Syntax Highlighter Usage Guide

# 项目已完成 | Project Completed
在线演示 | Online Demo: [https://1.lvjia.cc/](https://1.lvjia.cc/)

## 安装 | Installation

### 方法 1：直接引入文件 | Method 1: Direct File Import

1. 下载以下两个文件 | Download these two files:
   - `mcfunction-highlight.min.css`
   - `mcfunction-highlight.min.js`

2. 在 HTML 中引入文件 | Include files in your HTML:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mcfunction-highlight/dist/mcfunction-highlight.min.css">
<script src="https://cdn.jsdelivr.net/npm/mcfunction-highlight/dist/mcfunction-highlight.min.js"></script>
<script>
    // 等待 DOM 加载完成后初始化 Initialize after DOM content loaded
    window.addEventListener('DOMContentLoaded', () => {
        MCFunctionHighlight.init();
    });
</script>
    <pre><code class="language-mcfunction">execute as @a at @s run setblock ~ ~ ~ minecraft:stone
    </code></pre>
```

### 方法 2：Node.js 环境使用 | Method 2: Usage in Node.js Environment

1. 通过 npm 安装 | Install via npm:
```bash
npm install mcfunction-highlight
```

2. 在代码中使用 | Use in your code:
```javascript
// 导入模块
const MCFunction = require('mcfunction-highlight');

// MCFunction 代码
const code = `execute as @a at @s run setblock ~ ~ ~ minecraft:stone`;

// 生成高亮后的 HTML
const highlightedCode = MCFunction.highlightWithWrapper(code);

// 完整的 HTML 页面
const html = `
<!DOCTYPE html>
<html>
<head>
    <style>${MCFunction.getCSS()}</style>
</head>
<body>
    ${highlightedCode}
</body>
</html>
`;

console.log(html); // 输出生成的 HTML
```

## 使用方法 | Usage

### 浏览器环境 | Browser Environment

将你的 MCFunction 代码放在带有特定类名的 `<pre>` 和 `<code>` 标签中：
Place your MCFunction code within `<pre>` and `<code>` tags with specific class:

```html
<pre><code class="language-mcfunction">
execute at @a in minecraft:the_end run setblock ~ ~-1 ~ minecraft:diamond_block
</code></pre>
```

如果你需要手动高亮新添加的代码块：
If you need to manually highlight newly added code blocks:

```javascript
// 高亮单个元素 | Highlight single element
const codeElement = document.querySelector('pre > code.language-mcfunction');
MCFunctionHighlight.highlightElement(codeElement);

// 高亮所有元素 | Highlight all elements
MCFunctionHighlight.highlightAll();
```

注意：使用 highlightElement 方法时，确保传入的元素是带有 `language-mcfunction` 类名的 `<code>` 元素。
Note: When using the highlightElement method, make sure the input element is a `<code>` element with the `language-mcfunction` class.

### 配置选项 | Configuration Options

你可以在初始化前配置一些选项：
You can configure some options before initialization:

```javascript
// 配置选项 | Configure options
MCFunctionHighlight.configure({
    autoUpdate: false  // 禁用自动更新 | Disable auto-update
});

// 然后初始化 | Then initialize
MCFunctionHighlight.init();
```

可用的配置选项 | Available configuration options:
- `autoUpdate`: (默认值: true) 是否自动检测和高亮新添加的代码块。设为 false 时需要手动调用高亮方法。
  (Default: true) Whether to automatically detect and highlight newly added code blocks. When set to false, you need to call highlight methods manually.

### Node.js 环境 | Node.js Environment

Node.js 环境提供了三个主要方法：
Node.js environment provides three main methods:

1. `highlight(code)`: 返回高亮后的 HTML 代码片段 | Returns highlighted HTML code snippet
2. `highlightWithWrapper(code)`: 返回带有包装器的完整 HTML | Returns complete HTML with wrapper
3. `getCSS()`: 返回必要的 CSS 样式 | Returns required CSS styles

```javascript
const MCFunction = require('mcfunction-highlight');

// 基础高亮 Basic highlighting
const highlighted = MCFunction.highlight('execute as @a at @s run say Hello');

// 带包装器的高亮 Highlighting with wrapper
const withWrapper = MCFunction.highlightWithWrapper('execute as @a at @s run say Hello');

// 获取 CSS 样式 Get CSS styles
const css = MCFunction.getCSS();
```

### 特性 | Features

- 语法高亮 Syntax highlighting
- 自动复制按钮（仅浏览器环境）Auto-copy button (browser only)
- 暗色主题 Dark theme
- DOM 变化监听（仅浏览器环境）DOM mutation observer (browser only)
- 支持 Node.js 和浏览器环境 Support for both Node.js and browser environments
