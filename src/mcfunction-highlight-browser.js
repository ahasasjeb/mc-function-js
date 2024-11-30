import './mcfunction-highlight.css';
import MCFunctionHighlight from './mcfunction-highlight-universal.js';

// 浏览器环境自动初始化
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MCFunctionHighlight.init());
    } else {
        MCFunctionHighlight.init();
    }
}

export default MCFunctionHighlight;
