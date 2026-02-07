// modules/search.js - 搜索功能
import { GameState } from './game-state.js';
import { FileSystem } from './file-system.js';
import { showProgressHint, showGameHint, renderFileGrid, renderSearchResults } from './ui-render.js';

export const KeywordSystem = {
    triggers: {
        '月光': () => {
            if (!GameState.discoveredKeywords.has('月光')) {
                showProgressHint('发现关键词："月光"！解锁隐藏文件数量:2');
                GameState.discoveredKeywords.add('月光');
                GameState.gameProgress += 25;
            }
            GameState.searchResults = [FileSystem.getItem('secret'), FileSystem.getItem('report2')];
            renderSearchResults();
        },
        '月光2': () => {
            if (!GameState.discoveredKeywords.has('月光')) {
                showProgressHint('发现关键词："月光2"！解锁隐藏文件数量:2');
                GameState.discoveredKeywords.add('月光');
                GameState.gameProgress += 25;
            }
            GameState.searchResults = [FileSystem.getItem('secret'), FileSystem.getItem('report2')];
            renderSearchResults();
        },
        '被遗忘的角落': () => {
            showProgressHint('发现了关键词："被遗忘的角落"！隐藏区域已解锁。');
            GameState.discoveredKeywords.add('被遗忘的角落');
            GameState.searchResults = [FileSystem.getItem('forgotten')];
            renderSearchResults();
        },
        '最终线索': () => {
            showProgressHint('发现了关键词："最终线索"！隐藏区域已解锁。');
            GameState.discoveredKeywords.add('最终线索');
            GameState.searchResults = [FileSystem.getItem('final')];
            renderSearchResults();
        },
        '1984': () => {
            showProgressHint('最终秘密已揭开！游戏完成度100%！');
            GameState.discoveredKeywords.add('1984');
            GameState.gameProgress = 100;
            renderFileGrid();
        },
        '帮助': () => {
            showGameHint('提示：试试搜索"月光"、"被遗忘的角落"、"1984"等关键词。');
        }
    },
    
    processSearch(keyword) {
        const trimmedKeyword = keyword.trim().toLowerCase();
        
        if (this.triggers[trimmedKeyword]) {
            GameState.searchQuery = keyword;
            this.triggers[trimmedKeyword]();
            return true;
        }
        
        showGameHint('未找到相关内容，但这个关键词听起来有点熟悉...');
        GameState.searchResults = [];
        renderSearchResults();
        return false;
    }
};