import './mcfunction-highlight.css';

const MCFunctionHighlight = {
    init() {
        this.highlightAll();
        this.observeDOM();
    },

    highlightAll() {
        document.querySelectorAll('pre > code.language-mcfunction').forEach(element => {
            this.highlightElement(element);
        });
    },

    highlightElement(element) {
        const code = element.textContent;
        const highlighted = this.highlight(code);

        const wrapper = document.createElement('div');
        wrapper.className = 'mcfunction-viewer';

        const content = document.createElement('div');
        content.className = 'mcfunction-content';
        content.innerHTML = highlighted;
        wrapper.appendChild(content);

        const copyButton = document.createElement('button');
        copyButton.className = 'mcfunction-copy-button';
        copyButton.textContent = '复制';
        copyButton.addEventListener('click', () => this.copyCode(code, copyButton));
        wrapper.appendChild(copyButton);


        const pre = element.parentNode;
        pre.innerHTML = '';
        pre.appendChild(wrapper);
    },

    highlight(code) {
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
                //其他字符串
                .replace(/\b(list|add|speed|glowing|true|remove|modify|get|set|reset|enable|operation|display|numberformat|setdisplay)\b/g,
                    match => `<span class="string">${match}</span>`);

            return `<div>${line}</div>`;
        }).join('');
    },

    observeDOM() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const elements = node.querySelectorAll('pre > code.language-mcfunction');
                        elements.forEach(element => this.highlightElement(element));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },


    async copyCode(code, button) {
        try {
            await navigator.clipboard.writeText(code);
            button.textContent = '已复制！';
            button.classList.add('success');
            setTimeout(() => {
                button.textContent = '复制';
                button.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
            button.textContent = '复制失败';
            setTimeout(() => {
                button.textContent = '复制';
            }, 2000);
        }
    }
};

if (typeof window !== 'undefined') {
    window.MCFunctionHighlight = MCFunctionHighlight;
    MCFunctionHighlight.init();
}

export default MCFunctionHighlight;