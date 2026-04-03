const TOKEN_RULES = [
    { name: 'selector', regex: /@[apers](?:\[(?:[^\]]*(?:type|distance|limit|sort|x|y|z|dx|dy|dz|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|rotation|pitch|yaw)=[^\]]*)*\])?/g },
    { name: 'command', regex: /\b(execute|run)\b/g },
    { name: 'execute-modifier', regex: /\b(align|anchored|as|at|facing|in|positioned|rotated|store|result|success)\b/g },
    { name: 'execute-condition', regex: /\b(if|unless)\b/g },
    { name: 'command', regex: /\b(advancement|agent|alwaysday|attribute|ban|ban-ip|banlist|bossbar|camera|camerashake|clear|clearspawnpoint|teleport|clone|connect|damage|data|datapack|daylock|debug|deop|difficulty|effect|enchant|event|experience|fill|fillbiome|fog|forceload|function|gamemode|gamerule|give|help|hud|immutableworld|inputpermission|item|jfr|kick|kill|list|locate|loot|me|mobevent|msg|music|op|particle|permission|place|playsound|recipe|reload|ride|say|schedule|scoreboard|setblock|setworldspawn|spawnpoint|spreadplayers|stop|stopsound|summon|tag|tell|tellraw|time|title|tp|transfer|weather|whitelist|xp|tick)\b/g },
    { name: 'parameter', regex: /\b(type|distance|limit|sort|scores|tag|team|name|nbt|predicate|gamemode|level|advancements|rotation|pitch|yaw|dx|dy|dz|x|y|z|nearest|furthest|random|arbitrary|block|blocks|entity|score|matches|eyes|feet|dimension|storage|bossbar|scale)\b/g },
    { name: 'dimension', regex: /\b(overworld|the_nether|the_end)\b/g },
    { name: 'gamerule', regex: /\b(announceAdvancements|blockExplosionDropDecay|commandBlockOutput|commandModificationBlockLimit|disableElytraMovementCheck|disablePlayerMovementCheck|disableRaids|doDaylightCycle|doEntityDrops|doFireTick|doImmediateRespawn|doInsomnia|doLimitedCrafting|doMobLoot|doMobSpawning|doPatrolSpawning|doTileDrops|doTraderSpawning|doVinesSpread|doWardenSpawning|doWeatherCycle|drowningDamage|fallDamage|fireDamage|freezeDamage|functionCommandLimit|keepInventory|maxCommandChainLength|mobGriefing|naturalRegeneration|playersSleepingPercentage|projectilesCanBreakBlocks|pvp|randomTickSpeed|recipesUnlock|respawnBlocksExplode|sendCommandFeedback|showBorderEffect|showCoordinates|showDaysPlayed|showDeathMessages|showRecipeMessages|showTags|spawnRadius|tntExplodes|tntExplosionDropDecay)\b/g },
    { name: 'boolean', regex: /\b(true|false)\b/g },
    { name: 'number', regex: /\b(\d+(?:\.\.\d+)?)\b/g },
    { name: 'coordinates', regex: /[~^]-?\d*\.?\d*/g },
    { name: 'string', regex: /\b(list|add|speed|glowing|remove|modify|get|set|reset|enable|operation|display|numberformat|setdisplay)\b/g }
];

function getNextToken(line, cursor) {
    let bestMatch = null;

    TOKEN_RULES.forEach(rule => {
        rule.regex.lastIndex = cursor;
        const match = rule.regex.exec(line);

        if (!match) {
            return;
        }

        const candidate = {
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            type: rule.name
        };

        if (!bestMatch || candidate.start < bestMatch.start || (candidate.start === bestMatch.start && candidate.text.length > bestMatch.text.length)) {
            bestMatch = candidate;
        }
    });

    return bestMatch;
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function highlightLine(line) {
    const trimmed = line.trim();
    if (!trimmed) {
        return '<div>&nbsp;</div>';
    }

    if (trimmed.startsWith('#')) {
        return `<div class="comment">${escapeHtml(line)}</div>`;
    }

    let cursor = 0;
    let result = '';

    while (cursor < line.length) {
        const token = getNextToken(line, cursor);

        if (!token) {
            result += escapeHtml(line.slice(cursor));
            break;
        }

        result += escapeHtml(line.slice(cursor, token.start));
        result += `<span class="${token.type}">${escapeHtml(token.text)}</span>`;
        cursor = token.end;
    }

    return `<div>${result}</div>`;
}

const MCFunctionHighlight = {
    options: {
        autoUpdate: true
    },

    _initialized: false,
    _observer: null,

    highlight(code) {
        return code
            .trimEnd()
            .split('\n')
            .map(highlightLine)
            .join('');
    },

    configure(options) {
        Object.assign(this.options, options);
    },

    init() {
        if (this._initialized) {
            return;
        }

        this.highlightAll();
        if (this.options.autoUpdate) {
            this.observeDOM();
        }

        this._initialized = true;
    },

    highlightAll() {
        if (typeof document === 'undefined') {
            return;
        }

        document.querySelectorAll('pre > code.language-mcfunction').forEach(element => {
            this.highlightElement(element);
        });
    },

    highlightElement(element) {
        if (!element || !element.textContent) {
            return;
        }

        if (element.closest('.mcfunction-viewer')) {
            return;
        }

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
        if (typeof document === 'undefined' || this._observer) {
            return;
        }

        this._observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) {
                        return;
                    }

                    if (node.matches && node.matches('pre > code.language-mcfunction')) {
                        this.highlightElement(node);
                    }

                    if (node.querySelectorAll) {
                        node.querySelectorAll('pre > code.language-mcfunction').forEach(element => {
                            this.highlightElement(element);
                        });
                    }
                });
            });
        });

        this._observer.observe(document.body, {
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
    },

    highlightWithWrapper(code) {
        const highlighted = this.highlight(code);
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
}`;
    }
};

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            MCFunctionHighlight.init();
        });
    } else {
        MCFunctionHighlight.init();
    }
}

if (typeof window === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MCFunctionHighlight;
    }
} else {
    window.MCFunctionHighlight = MCFunctionHighlight;
}

if (typeof exports !== 'undefined') {
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.default = MCFunctionHighlight;
}
