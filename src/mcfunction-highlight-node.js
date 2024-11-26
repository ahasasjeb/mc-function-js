class MCFunctionHighlightNode {
    static highlight(code) {
        return code.split('\n').map(line => {
            if (!line.trim()) {
                return '';
            }

            if (line.trim().startsWith('#')) {
                return line;
            }

            // 保持原有的正则替换逻辑，但移除HTML标签
            line = line
                // execute子命令
                .replace(/\b(execute|run)\b/g, '$1')
                // execute修饰子命令
                .replace(/\b(align|anchored|as|at|facing|in|positioned|rotated|store|result|success)\b/g, '$1')
                // execute条件子命令
                .replace(/\b(if|unless)\b/g, '$1')
                // 其他命令
                .replace(/\b(advancement|agent|alwaysday|attribute|ban|ban-ip|banlist|bossbar|camera|camerashake|clear|clearspawnpoint|clone|connect|damage|data|datapack|daylock|debug|deop|difficulty|effect|enchant|event|experience|fill|fillbiome|fog|forceload|function|gamemode|gamerule|give|help|hud|immutableworld|inputpermission|item|jfr|kick|kill|list|locate|loot|me|mobevent|msg|music|op|particle|permission|place|playsound|recipe|reload|ride|say|schedule|scoreboard|setblock|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|tell|tellraw|time|title|tp|transfer|weather|whitelist|xp)\b/g, '$1')
                // 选择器
                .replace(/@[apers](?:\[(?:[^\]]*(?:type|distance|limit|sort|x|y|z|dx|dy|dz|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|nbt|rotation|pitch|yaw)=[^\]]*)*\])?/g, '$&')
                // 坐标
                .replace(/(?:^|\s)([~^][-\d]*\.?\d*)/g, '$&')
                // 数字和范围
                .replace(/\b(\d+(?:\.\.\d+)?)\b/g, '$1')
                // 布尔值
                .replace(/\b(true|false)\b/g, '$1')
                // 选择器参数和execute参数
                .replace(/\b(type|distance|limit|sort|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|rotation|pitch|yaw|dx|dy|dz|x|y|z|sort|nearest|furthest|random|arbitrary|block|blocks|entity|score|matches|eyes|feet|dimension|storage|bossbar|scale)\b/g, '$1')
                // 维度ID
                .replace(/\b(overworld|the_nether|the_end)\b/g, '$1')
                // 其他字符串
                .replace(/\b(list|add|speed|glowing|true|remove|modify|get|set|reset|enable|operation|display|numberformat|setdisplay)\b/g, '$1');

            return line;
        }).join('\n');
    }

    // 添加一个方法来获取语法分析结果
    static analyze(code) {
        const analysis = {
            commands: new Set(),
            selectors: new Set(),
            coordinates: new Set(),
            parameters: new Set()
        };

        code.split('\n').forEach(line => {
            // 提取命令
            const commandMatch = line.match(/\b(execute|run|advancement|agent|alwaysday|attribute|ban|ban-ip|banlist|bossbar|camera|camerashake|clear|clearspawnpoint|clone|connect|damage|data|datapack|daylock|debug|deop|difficulty|effect|enchant|event|experience|fill|fillbiome|fog|forceload|function|gamemode|gamerule|give|help|hud|immutableworld|inputpermission|item|jfr|kick|kill|list|locate|loot|me|mobevent|msg|music|op|particle|permission|place|playsound|recipe|reload|ride|say|schedule|scoreboard|setblock|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|tell|tellraw|time|title|tp|transfer|weather|whitelist|xp)\b/g);
            if (commandMatch) {
                commandMatch.forEach(cmd => analysis.commands.add(cmd));
            }

            // 提取选择器
            const selectorMatch = line.match(/@[apers](?:\[.*?\])?/g);
            if (selectorMatch) {
                selectorMatch.forEach(selector => analysis.selectors.add(selector));
            }

            // 提取坐标
            const coordMatch = line.match(/[~^][-\d]*\.?\d*/g);
            if (coordMatch) {
                coordMatch.forEach(coord => analysis.coordinates.add(coord));
            }

            // 提取参数
            const paramMatch = line.match(/\b(type|distance|limit|sort|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|rotation|pitch|yaw|dx|dy|dz)\b/g);
            if (paramMatch) {
                paramMatch.forEach(param => analysis.parameters.add(param));
            }
        });

        // 转换Set为数组
        return {
            commands: [...analysis.commands],
            selectors: [...analysis.selectors],
            coordinates: [...analysis.coordinates],
            parameters: [...analysis.parameters]
        };
    }
}

module.exports = MCFunctionHighlightNode; 