// modules/game-state.js - 游戏状态管理
export const GameState = {
    currentPath: ['root'],
    discoveredKeywords: new Set(),
    unlockedFiles: new Set(),
    gameProgress: 0,
    searchResults: [],        // 搜索结果
    searchQuery: '',          // 搜索关键词
    // 添加加密相关状态
    unlockedEncryptedFiles: new Set(),  // 已解密的文件ID
    
    save() {
        // try {
        //     const data = {
        //         path: this.currentPath,
        //         discovered: [...this.discoveredKeywords],
        //         unlocked: [...this.unlockedFiles],
        //         progress: this.gameProgress,
        //         timestamp: new Date().toISOString()
        //     };
            
        //     localStorage.setItem('filePuzzleGame', JSON.stringify(data));
        //     return true;
        // } catch (error) {
        //     console.error('保存失败:', error);
        //     return false;
        // }
    },
    
    load() {
        // try {
        //     const saved = localStorage.getItem('filePuzzleGame');
        //     if (!saved) return false;
            
        //     const data = JSON.parse(saved);
            
        //     this.currentPath = data.path || ['root'];
        //     this.discoveredKeywords = new Set(data.discovered || []);
        //     this.unlockedFiles = new Set(data.unlocked || []);
        //     this.gameProgress = data.progress || 0;
            
        //     return true;
        // } catch (error) {
        //     console.error('加载失败:', error);
        //     return false;
        // }
    },
    
    reset() {
        this.currentPath = ['root'];
        this.discoveredKeywords.clear();
        this.unlockedFiles.clear();
        this.gameProgress = 0;
        localStorage.removeItem('filePuzzleGame');
    },

    // 检查文件是否已解密
    isFileDecrypted(fileId) {
        return this.unlockedEncryptedFiles.has(fileId);
    }
};