# MCFunction 语法高亮工具使用指南 | MCFunction Syntax Highlighter Usage Guide

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
        MCFunctionHighlight.default.init();
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
MCFunctionHighlight.default.highlightElement(codeElement);

// 高亮所有元素 | Highlight all elements
MCFunctionHighlight.default.highlightAll();
```

### 支持的语法高亮 | Supported Syntax Highlighting

- 命令 Commands (`execute`, `give`, `tp` 等) - 蓝色 Blue
- 选择器 Selectors (`@a`, `@p`, `@e`, `@s`, `@r`) - 青色 Teal
- 坐标 Coordinates (`~`, `^` 开头的相对坐标) - 浅绿色 Light Green
- 字符串 Strings (方块ID、物品ID等) - 橙色 Orange
- 注释 Comments (`#` 开头) - 绿色 Green
- 数字 Numbers - 浅绿色 Light Green
- Execute修饰符 Execute Modifiers (`as`, `at`, `in` 等) - 粉色 Pink
- Execute条件 Execute Conditions (`if`, `unless`) - 红色 Red
- 参数 Parameters (`type`, `distance` 等) - 浅蓝色 Light Blue
- 维度ID Dimensions (`overworld`, `the_nether`, `the_end`) - 青色 Teal

### 特性 | Features

- 自动复制按钮 Automatic copy button
- 动态内容监听 Dynamic content observation
- 响应式设计 Responsive design
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
            MCFunctionHighlight.default.init();
        });
    </script>
</body>
</html>
```

这个工具会自动监听 DOM 变化，所以动态添加的代码块也会自动高亮。
The tool automatically monitors DOM changes, so dynamically added code blocks will be highlighted automatically.
项目基于MIT许可证，你可以自由修改，这个项目未来应该也会有更新。
The project is based on the MIT license, allowing you to freely modify it. It is expected that there will be updates to this project in the future.
