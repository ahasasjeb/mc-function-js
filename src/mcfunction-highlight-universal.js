const EXECUTE_REGEX = /\b(execute|run)\b/g;
const EXECUTE_MODIFIER_REGEX = /\b(align|anchored|as|at|facing|in|positioned|rotated|store|result|success)\b/g;
const EXECUTE_CONDITION_REGEX = /\b(if|unless)\b/g;
const COMMAND_REGEX = /\b(advancement|agent|alwaysday|attribute|ban|ban-ip|banlist|bossbar|camera|camerashake|clear|clearspawnpoint|teleport|clone|connect|damage|data|datapack|daylock|debug|deop|difficulty|effect|enchant|event|experience|fill|fillbiome|fog|forceload|function|gamemode|gamerule|give|help|hud|immutableworld|inputpermission|item|jfr|kick|kill|list|locate|loot|me|mobevent|msg|music|op|particle|permission|place|playsound|recipe|reload|ride|say|schedule|scoreboard|setblock|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|tell|tellraw|time|title|tp|transfer|weather|whitelist|xp|tick)\b/g;
const SELECTOR_REGEX = /@[apers](?:\[(?:[^\]]*(?:type|distance|limit|sort|x|y|z|dx|dy|dz|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|nbt|rotation|pitch|yaw)=[^\]]*)*\])?/g;
const COORDINATE_REGEX = /(?:^|\s)([~^][-\d]*\.?\d*)/g;
const NUMBER_REGEX = /\b(\d+(?:\.\.\d+)?)\b/g;
const BOOLEAN_REGEX = /\b(true|false)\b/g;
const PARAMETER_REGEX = /\b(type|distance|limit|sort|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|rotation|pitch|yaw|dx|dy|dz|x|y|z|sort|nearest|furthest|random|arbitrary|block|blocks|entity|score|matches|eyes|feet|dimension|storage|bossbar|scale)\b/g;
const DIMENSION_REGEX = /\b(overworld|the_nether|the_end)\b/g;
const GAMERULE_REGEX = /\b(announceAdvancements|blockExplosionDropDecay|commandBlockOutput|commandModificationBlockLimit|disableElytraMovementCheck|disablePlayerMovementCheck|disableRaids|doDaylightCycle|doEntityDrops|doFireTick|doImmediateRespawn|doInsomnia|doLimitedCrafting|doMobLoot|doMobSpawning|doPatrolSpawning|doTileDrops|doTraderSpawning|doVinesSpread|doWardenSpawning|doWeatherCycle|drowningDamage|fallDamage|fireDamage|freezeDamage|functionCommandLimit|keepInventory|maxCommandChainLength|mobGriefing|naturalRegeneration|playersSleepingPercentage|projectilesCanBreakBlocks|pvp|randomTickSpeed|recipesUnlock|respawnBlocksExplode|sendCommandFeedback|showBorderEffect|showCoordinates|showDaysPlayed|showDeathMessages|showRecipeMessages|showTags|spawnRadius|tntExplodes|tntExplosionDropDecay)\b/g;
const STRING_REGEX = /\b(list|add|speed|glowing|remove|modify|get|set|reset|enable|operation|display|numberformat|setdisplay)\b/g;

const MCFunctionHighlight = {
    highlight(code) {
        return code.trimEnd().split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) {
                return '<div>&nbsp;</div>';
            }

            if (trimmed.startsWith('#')) {
                return `<div class="comment">${line}</div>`;
            }

            line = line
                // execute子命令
                .replace(EXECUTE_REGEX,
                    match => `<span class="command">${match}</span>`)
                // execute修饰子命令
                .replace(EXECUTE_MODIFIER_REGEX,
                    match => `<span class="execute-modifier">${match}</span>`)
                // execute条件子命令
                .replace(EXECUTE_CONDITION_REGEX,
                    match => `<span class="execute-condition">${match}</span>`)
                // 其他命令
                .replace(COMMAND_REGEX,
                    match => `<span class="command">${match}</span>`)
                // 选择器
                .replace(SELECTOR_REGEX,
                    match => `<span class="selector">${match}</span>`)
                // 坐标
                .replace(COORDINATE_REGEX,
                    (match, coord) => match.replace(coord, `<span class="coordinates">${coord}</span>`))
                // 数字和范围
                .replace(NUMBER_REGEX,
                    match => `<span class="number">${match}</span>`)
                // 布尔值
                .replace(BOOLEAN_REGEX,
                    match => `<span class="boolean">${match}</span>`)
                // 选择器参数和execute参数
                .replace(PARAMETER_REGEX,
                    match => `<span class="parameter">${match}</span>`)
                // 维度ID
                .replace(DIMENSION_REGEX,
                    match => `<span class="dimension">${match}</span>`)
                //游戏规则
                .replace(GAMERULE_REGEX,
                    match => `<span class="gamerule">${match}</span>`)
                // 其他字符串
                .replace(STRING_REGEX,
                    match => `<span class="string">${match}</span>`);

            return `<div>${line}</div>`;
        }).join('');
    },

    // 配置选项
    options: {
        autoUpdate: true
    },

    // 设置选项
    configure(options) {
        Object.assign(this.options, options);
    },

    // 浏览器特定功能
    init() {
        this.highlightAll();
        if (this.options.autoUpdate) {
            this.observeDOM();
        }
    },

    highlightAll() {
        if (typeof document !== 'undefined') {
            document.querySelectorAll('pre > code.language-mcfunction').forEach(element => {
                this.highlightElement(element);
            });
        }
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

    observeDOM() {
        if (typeof document !== 'undefined') {
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
        }
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
    },

    // Node.js 特定功能
    highlightWithWrapper(code) {
        const highlighted = this.highlight(code);
        // 在 Node.js 环境下不包含复制按钮
        return `<pre class="mcfunction-viewer"><code class="mcfunction-content">${highlighted}</code></pre>`;
    },

    getCSS() {
        return `
.mcfunction-viewer {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    background: #1e1e1e !important;
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
    overflow: hidden;
    border-radius: 0.3em;
    position: relative;
    display: flex;
    min-height: 50px;
    width: 100%;
    box-sizing: border-box;
}

.mcfunction-content {
    overflow: auto;
    padding-right: 20px;
    flex: 1;
    min-width: 0;
    width: 100%;
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
.mcfunction-viewer .gamerule {color:#7fffd4}

/* 只在浏览器环境中显示复制按钮相关样式 */
${typeof window !== 'undefined' ? `
.mcfunction-copy-button {
    position: sticky;
    right: 0.5em;
    top: 0.5em;
    height: fit-content;
    margin-left: 10px;
    flex-shrink: 0;
    padding: 0.4em 0.8em;
    background: #333;
    border: 1px solid #666;
    border-radius: 0.3em;
    color: #d4d4d4;
    font-size: 0.8em;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
}

.mcfunction-copy-button:hover {
    background: #444;
}

.mcfunction-copy-button.success {
    background: #28a745;
    border-color: #28a745;
}

.mcfunction-viewer:hover .mcfunction-copy-button {
    opacity: 1;
}` : ''}`;
    }
};

// 浏览器环境自动初始化
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MCFunctionHighlight.init();
        });
    } else {
        MCFunctionHighlight.init();
    }
}

// 根据环境导出不同的接口
if (typeof window === 'undefined') {
    // Node.js 环境
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MCFunctionHighlight;
    }
} else {
    // 浏览器环境
    window.MCFunctionHighlight = MCFunctionHighlight;
}

// 为了支持 ES modules
if (typeof exports !== 'undefined') {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MCFunctionHighlight;
}
