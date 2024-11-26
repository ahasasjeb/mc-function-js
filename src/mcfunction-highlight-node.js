class MCFunctionHighlightNode {
    static highlight(code) {
        return code.split('\n').map(line => {
            if (!line.trim()) {
                return '<div>&nbsp;</div>';
            }

            if (line.trim().startsWith('#')) {
                return `<div class="comment">${line}</div>`;
            }

            line = line
                // execute子命令
                .replace(/\b(execute|run)\b/g,
                    match => `<span class="command">${match}</span>`)
                // execute修饰子命令
                .replace(/\b(align|anchored|as|at|facing|in|positioned|rotated|store|result|success)\b/g,
                    match => `<span class="execute-modifier">${match}</span>`)
                // execute条件子命令
                .replace(/\b(if|unless)\b/g,
                    match => `<span class="execute-condition">${match}</span>`)
                // 其他命令
                .replace(/\b(advancement|agent|alwaysday|attribute|ban|ban-ip|banlist|bossbar|camera|camerashake|clear|clearspawnpoint|clone|connect|damage|data|datapack|daylock|debug|deop|difficulty|effect|enchant|event|experience|fill|fillbiome|fog|forceload|function|gamemode|gamerule|give|help|hud|immutableworld|inputpermission|item|jfr|kick|kill|list|locate|loot|me|mobevent|msg|music|op|particle|permission|place|playsound|recipe|reload|ride|say|schedule|scoreboard|setblock|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|tell|tellraw|time|title|tp|transfer|weather|whitelist|xp)\b/g,
                    match => `<span class="command">${match}</span>`)
                // 选择器
                .replace(/@[apers](?:\[(?:[^\]]*(?:type|distance|limit|sort|x|y|z|dx|dy|dz|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|nbt|rotation|pitch|yaw)=[^\]]*)*\])?/g,
                    match => `<span class="selector">${match}</span>`)
                // 坐标
                .replace(/(?:^|\s)([~^][-\d]*\.?\d*)/g,
                    (match, coord) => match.replace(coord, `<span class="coordinates">${coord}</span>`))
                // 数字和范围
                .replace(/\b(\d+(?:\.\.\d+)?)\b/g,
                    match => `<span class="number">${match}</span>`)
                // 布尔值
                .replace(/\b(true|false)\b/g,
                    match => `<span class="boolean">${match}</span>`)
                // 选择器参数和execute参数
                .replace(/\b(type|distance|limit|sort|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|rotation|pitch|yaw|dx|dy|dz|x|y|z|sort|nearest|furthest|random|arbitrary|block|blocks|entity|score|matches|eyes|feet|dimension|storage|bossbar|scale)\b/g,
                    match => `<span class="parameter">${match}</span>`)
                // 维度ID
                .replace(/\b(overworld|the_nether|the_end)\b/g,
                    match => `<span class="dimension">${match}</span>`)
                // 其他字符串
                .replace(/\b(list|add|speed|glowing|true|remove|modify|get|set|reset|enable|operation|display|numberformat|setdisplay)\b/g,
                    match => `<span class="string">${match}</span>`);

            return `<div>${line}</div>`;
        }).join('');
    }

    // 修改 highlightWithWrapper 方法以包含复制按钮
    static highlightWithWrapper(code) {
        const highlighted = this.highlight(code);
        return `
            <div class="mcfunction-viewer">
                <div class="mcfunction-content">
                    ${highlighted}
                </div>
                <button class="mcfunction-copy-button">复制</button>
            </div>`;
    }

    // 移除 getCSS 方法，改为从外部文件读取
    static async getCSS() {
        const fs = require('fs').promises;
        const path = require('path');
        try {
            const cssPath = path.join(__dirname, 'mcfunction-highlight.css');
            return await fs.readFile(cssPath, 'utf8');
        } catch (err) {
            console.error('Error reading CSS file:', err);
            return '';
        }
    }
}

module.exports = MCFunctionHighlightNode;