// main.js - 应用入口
import { initializeApp } from './modules/ui-render.js';
import { setupEventListeners } from './modules/navigation.js';
import { GameState } from './modules/game-state.js';

// 应用初始化
function init() {
    // 加载游戏状态
    GameState.load();
    
    // 初始化UI
    initializeApp();
    
    // 设置事件监听
    setupEventListeners();
    
    // 自动保存
    setInterval(() => GameState.save(), 30000);
    
    console.log('应用初始化完成');
}

// DOM加载完成后启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}