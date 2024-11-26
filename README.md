# MCFunction 语法高亮工具使用指南 | MCFunction Syntax Highlighter Usage Guide

# 项目处于测试版，仍在开发！| The project is in beta testing and is still under development!
在线演示 | Online Demo: [https://1.lvjia.cc/](https://1.lvjia.cc/)

## 安装 | Installation

### 方法 1：直接引入文件 | Method 1: Direct File Import

1. 下载以下两个文件 | Download these two files:
   - `mcfunction-highlight.css`
   - `mcfunction-highlight.js`

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
```

## 使用方法 | Usage

### 基础用法 | Basic Usage

将你的 MCFunction 代码放在带有特定类名的 `<pre>` 和 `<code>` 标签中：
Place your MCFunction code within `<pre>` and `<code>` tags with specific class:

```html
<pre><code class="language-mcfunction">
execute at @a in minecraft:the_end run setblock ~ ~-1 ~ minecraft:diamond_block
</code></pre>
```

### 手动高亮特定元素 | Manually Highlight Specific Elements

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

### 特性 | Features

- 自动复制按钮 Automatic copy button
- 暗色主题 Dark theme

### 示例 | Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/mcfunction-highlight@latest/dist/mcfunction-highlight.min.css">
    <script src="https://cdn.jsdelivr.net/npm/mcfunction-highlight@latest/dist/mcfunction-highlight.min.js"></script>
</head>
<body>
    <pre><code class="language-mcfunction"># 这是一个注释 This is a comment
execute at @a in minecraft:the_end run setblock ~ ~-1 ~ minecraft:diamond_block</code></pre>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            MCFunctionHighlight.init();
        });
    </script>
</body>
</html>
```

这个工具会自动监听 DOM 变化，所以动态添加的代码块也会自动高亮。
The tool automatically monitors DOM changes, so dynamically added code blocks will be highlighted automatically.
项目基于MIT许可证，你可以自由修改。
The project is based on the MIT license, allowing you to freely modify it.

### 与其他语法高亮库共存 | Coexistence with Other Syntax Highlighters

If you also use other syntax highlighting libraries (such as Prism. js or Highlight. js) in your project, please load the scripts in the following order to avoid conflicts:
如果你的项目中同时使用了其他语法高亮库（如 Prism.js 或 Highlight.js），请按照以下顺序加载脚本以避免冲突：

```html
<!-- 1. 首先加载其他语法高亮库的样式 First load other syntax highlighter styles -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css" rel="stylesheet">

<!-- 2. 然后加载 MCFunction 高亮样式 Then load MCFunction highlighter styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mcfunction-highlight/dist/mcfunction-highlight.min.css">

<!-- 3. 加载其他语法高亮库的脚本 Load other syntax highlighter scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>

<!-- 4. 最后加载 MCFunction 高亮脚本 Finally load MCFunction highlighter script -->
<script src="https://cdn.jsdelivr.net/npm/mcfunction-highlight/dist/mcfunction-highlight.min.js"></script>

<script>
    // 5. 初始化各个高亮库 Initialize all highlighters
    hljs.highlightAll(); // 如果使用了 Highlight.js
    // Prism.js 会自动初始化
    window.addEventListener('DOMContentLoaded', () => {
        MCFunctionHighlight.init();
    });
</script>
```

按照这个顺序加载可以尽量避免各个语法高亮库正常工作且互不干扰。
Loading in this order can try to avoid the normal operation of various syntax highlighting libraries without interfering with each other.

### Node.js 环境使用 | Usage in Node.js Environment

如果你需要在服务器端生成高亮代码，可以使用 Node.js 版本：
If you need to generate highlighted code on the server side, you can use the Node.js version:

```javascript
const MCFunctionHighlightNode = require('mcfunction-highlight/node');

// 示例1：直接获取高亮HTML | Example 1: Get highlighted HTML directly
const code = `execute as @a at @s run tp @s ~ ~1 ~`;
const highlightedHtml = MCFunctionHighlightNode.highlight(code);
console.log(highlightedHtml);
// 输出 | Output:
// <div><span class="command">execute</span> <span class="execute-modifier">as</span> <span class="selector">@a</span> <span class="execute-modifier">at</span> <span class="selector">@s</span> <span class="command">run</span> <span class="command">tp</span> <span class="selector">@s</span> <span class="coordinates">~</span> <span class="coordinates">~1</span> <span class="coordinates">~</span></div>

// 示例2：获取完整的HTML（包含wrapper） | Example 2: Get complete HTML (with wrapper)
const completeHtml = MCFunctionHighlightNode.highlightWithWrapper(code);

// 示例3：获取CSS样式 | Example 3: Get CSS styles
const css = MCFunctionHighlightNode.getCSS();

// 示例4：在服务端渲染完整页面 | Example 4: Render complete page on server side
const fullPage = `
<!DOCTYPE html>
<html>
<head>
    <style>${MCFunctionHighlightNode.getCSS()}</style>
</head>
<body>
    ${MCFunctionHighlightNode.highlightWithWrapper(code)}
</body>
</html>
`;
```

在Express中使用示例 | Usage example in Express:

```javascript
const express = require('express');
const MCFunctionHighlightNode = require('mcfunction-highlight/node');
const app = express();

app.get('/highlight', (req, res) => {
    const code = req.query.code || 'execute as @a at @s run tp @s ~ ~1 ~';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>${MCFunctionHighlightNode.getCSS()}</style>
        </head>
        <body>
            ${MCFunctionHighlightNode.highlightWithWrapper(code)}
        </body>
        </html>
    `);
});

app.listen(3000);
```

在Next.js中使用示例 | Usage example in Next.js:

```jsx
// pages/mcfunction.js
import MCFunctionHighlightNode from 'mcfunction-highlight/node';

export default function MCFunctionPage({ code }) {
    return (
        <div>
            <style dangerouslySetInnerHTML={{ __html: MCFunctionHighlightNode.getCSS() }} />
            <div dangerouslySetInnerHTML={{ 
                __html: MCFunctionHighlightNode.highlightWithWrapper(code) 
            }} />
        </div>
    );
}

export async function getServerSideProps({ query }) {
    const code = query.code || 'execute as @a at @s run tp @s ~ ~1 ~';
    return {
        props: { code }
    };
}
```

