const MCFunctionHighlight = require('../src/mcfunction-highlight-universal.js');
const fs = require('fs');
const path = require('path');

// 测试代码
const testCases = [
    {
        name: '基础命令测试',
        code: `# 这是一个注释
execute as @a at @s run tp @s ~ ~1 ~
give @p diamond_sword{display:{Name:'{"text":"测试剑"}'}} 1
scoreboard objectives add test dummy "测试计分板"`
    },
    {
        name: '复杂命令测试',
        code: `# 游戏规则设置
gamerule doMobSpawning false
gamerule doDaylightCycle true

# 复杂的execute命令
execute as @e[type=zombie,distance=..10] at @s facing entity @p eyes run tp @s ^ ^ ^0.1
execute if score @p test matches 10..20 run function namespace:test

# NBT数据测试
data modify storage test:storage root.test set value {count:1b,name:"test"}`
    }
];

// 运行测试
console.log('MCFunction Highlight Node.js 测试\n');

testCases.forEach(test => {
    console.log(`=== ${test.name} ===`);
    console.log('原始代码:');
    console.log(test.code);
    console.log('\n高亮后的HTML:');
    console.log(MCFunctionHighlight.highlight(test.code));
    console.log('\n');
});

// 输出CSS
console.log('=== CSS 样式 ===');
console.log(MCFunctionHighlight.getCSS());

// 保存测试结果到HTML文件
const testResults = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MCFunction Highlight Node.js Test Results</title>
    <style>
        ${MCFunctionHighlight.getCSS()}
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
        }
        .test-case {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: #333;
        }
        pre {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>MCFunction Highlight Node.js 测试结果</h1>
    ${testCases.map(test => `
        <div class="test-case">
            <h2>${test.name}</h2>
            <h3>原始代码:</h3>
            <pre><code>${test.code}</code></pre>
            <h3>高亮后的HTML:</h3>
            ${MCFunctionHighlight.highlightWithWrapper(test.code)}
        </div>
    `).join('')}
</body>
</html>`;

const outputPath = path.join(__dirname, 'test-results.html');
fs.writeFileSync(outputPath, testResults);
console.log(`\n测试结果已保存到: ${outputPath}`);
