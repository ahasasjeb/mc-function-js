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

    // 生成完整的HTML，包含样式
    static highlightWithWrapper(code) {
        const highlighted = this.highlight(code);
        return `
            <div class="mcfunction-viewer">
                <div class="mcfunction-content">
                    ${highlighted}
                </div>
            </div>`;
    }

    // 获取默认CSS样式
    static getCSS() {
        return `
            .mcfunction-viewer {
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                background: #1e1e1e;
                color: #d4d4d4;
                text-shadow: 0 1px rgba(0, 0, 0, 0.3);
                text-align: left;
                white-space: pre;
                word-spacing: normal;
                word-break: normal;
                line-height: 1.5;
                tab-size: 4;
                hyphens: none;
                padding: 1em;
                margin: 0;
                overflow: auto;
                border-radius: 0.3em;
            }
            .mcfunction-viewer .command { color: #ffaa00; font-weight: bold; }
            .mcfunction-viewer .selector { color: #55ffff; }
            .mcfunction-viewer .coordinates { color: #55ff55; }
            .mcfunction-viewer .string { color: #ff5555; }
            .mcfunction-viewer .comment { color: #7f7f7f; }
            .mcfunction-viewer .number { color: #55ff55; }
            .mcfunction-viewer .execute-modifier { color: #ff55ff; }
            .mcfunction-viewer .execute-condition { color: #ff5555; }
            .mcfunction-viewer .parameter { color: #55ffff; }
            .mcfunction-viewer .dimension { color: #55ffff; }
            .mcfunction-viewer .boolean { color: #ffaa00; }
        `;
    }
}

module.exports = MCFunctionHighlightNode;