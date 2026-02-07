// modules/navigation.js - 导航功能
import { GameState } from './game-state.js';
import { FileSystem } from './file-system.js';
import { renderBreadcrumb, renderFileGrid, updateUI } from './ui-render.js';

export function navigateToFolder(folderId) {
    const targetFolder = FileSystem.getItem(folderId);
    if (!targetFolder || targetFolder.type !== 'folder') return;
    
    if (GameState.currentPath[GameState.currentPath.length - 1] === folderId) {
        return;
    }

    // 检查是否是加密文件夹
    if (targetFolder.encrypted && !GameState.isFileDecrypted(folderId)) {
        // 显示密码输入框
        import('./encryption.js').then(module => {
            module.showPasswordPrompt(targetFolder);
        });
        return;
    }
    
    const path = findPathToFolder(folderId);
    GameState.currentPath = path || ['root', folderId];
    
    updateUI();
    GameState.save();
}

export function goBack() {
    if (GameState.currentPath.length > 1) {
        GameState.currentPath.pop();
        updateUI();
        GameState.save();
    }
}

export function findPathToFolder(folderId) {
    const path = ['root'];
    
    function search(current, targetId, currentPath) {
        if (current.id === targetId) {
            return [...currentPath, current.id];
        }
        
        if (current.children) {
            for (const child of current.children) {
                const result = search(child, targetId, [...currentPath, current.id]);
                if (result) return result;
            }
        }
        
        return null;
    }
    
    return search(FileSystem.root, folderId, []);
}

export function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchBtn && searchInput) {
        const performSearch = () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                // 这里需要导入搜索模块
                import('./search.js').then(module => {
                    module.KeywordSystem.processSearch(keyword);
                    searchInput.value = '';
                    GameState.save();
                });
            }
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // 返回按钮
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    
    // 重置按钮
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置游戏吗？')) {
                GameState.reset();
                updateUI();
            }
        });
    }
    
    // 面包屑和文件点击事件
    document.addEventListener('click', handleGlobalClick);
}

function handleGlobalClick(e) {
    // 面包屑点击
    if (e.target.closest('.breadcrumb-item a')) {
        e.preventDefault();
        const pathData = e.target.closest('.breadcrumb-item a').dataset.path;
        const path = JSON.parse(pathData);
        GameState.currentPath = path;
        updateUI();
        GameState.save();
        return;
    }
    
    // 文件点击
    if (e.target.closest('.file-item')) {
        const fileItem = e.target.closest('.file-item');
        const fileId = fileItem.dataset.id;
        const fileType = fileItem.dataset.type;
        
        const file = FileSystem.getItem(fileId);
        if (!file) return;
        
        if (fileType === 'folder') {
            navigateToFolder(fileId);
        } else {
            // 导入文件预览模块
            import('./file-preview.js').then(module => {
                module.showFilePreview(file);
            });
        }
    }
}