// ==================== 游戏状态管理 ====================
const GameState = {
    currentPath: ['root'],              // 当前路径栈
    discoveredKeywords: new Set(),      // 已发现的关键词
    unlockedFiles: new Set(),           // 已解锁的文件ID
    gameProgress: 0,                    // 游戏进度 (0-100)
    
    // 保存游戏状态到本地存储
    save() {
        localStorage.setItem('filePuzzleGame', JSON.stringify({
            path: this.currentPath,
            discovered: [...this.discoveredKeywords],
            unlocked: [...this.unlockedFiles],
            progress: this.gameProgress
        }));
    },
    
    // 从本地存储加载游戏状态
    load() {
        const saved = localStorage.getItem('filePuzzleGame');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentPath = data.path || ['root'];
            this.discoveredKeywords = new Set(data.discovered || []);
            this.unlockedFiles = new Set(data.unlocked || []);
            this.gameProgress = data.progress || 0;
            return true;
        }
        return false;
    }
};

// ==================== 虚拟文件系统 ====================
const FileSystem = {
    // 通过ID获取文件/文件夹
    getItem(id) {
        return this._findItem(id, this.root);
    },
    
    // 递归查找项目
    _findItem(id, currentNode) {
        if (currentNode.id === id) return currentNode;
        
        if (currentNode.children) {
            for (const child of currentNode.children) {
                const found = this._findItem(id, child);
                if (found) return found;
            }
        }
        return null;
    },
    
    // 获取当前路径对应的文件夹
    getCurrentFolder() {
        let current = this.root;
        console.log(this.currentPath);
        for (let i = 1; i < GameState.currentPath.length; i++) {
            const id = GameState.currentPath[i];
            current = current.children.find(item => item.id === id);
            if (!current) break;
        }
        return current;
    },
    
    // 判断文件是否应该显示
    shouldShowFile(file) {
        // 普通文件始终显示
        if (!file.hidden) return true;
        
        // 隐藏文件需要满足条件才显示
        if (file.unlockCondition) {
            if (file.unlockCondition.type === 'keyword') {
                return GameState.discoveredKeywords.has(file.unlockCondition.value);
            }
            if (file.unlockCondition.type === 'progress') {
                return GameState.gameProgress >= file.unlockCondition.value;
            }
        }
        
        return false;
    },
    
    // 根目录结构
    root: {
        id: 'root',
        name: '我的文件',
        type: 'folder',
        children: [
            {
                id: 'work',
                name: '工作文档',
                type: 'folder',
                children: [
                    {
                        id: 'report',
                        name: '周报.txt',
                        type: 'file',
                        content: '本周工作正常进行中。\n明天需要提交季度总结。',
                        size: '2KB'
                    },
                    {
                        id: 'meeting',
                        name: '会议记录.txt',
                        type: 'file',
                        content: '会议主题：项目进展\n\n讨论了关于新功能开发的时间表。\n备注：密码可能藏在日常用语中。',
                        size: '5KB'
                    }
                ]
            },
            {
                id: 'personal',
                name: '个人资料',
                type: 'folder',
                children: [
                    {
                        id: 'notes',
                        name: '笔记.txt',
                        type: 'file',
                        content: '突然想起小时候的暗号："月光下的约定"\n这个好像可以用来解锁什么...',
                        size: '3KB'
                    },
                    {
                        id: 'photo',
                        name: '老照片.jpg',
                        type: 'file',
                        content: `
                            <div class="image-description">
                                <p>一张泛黄的老照片，背面写着：1984年夏</p>
                                <div class="image-container">
                                    <img src="img1.png" alt="泛黄的老照片" class="old-photo" width="100">
                                    <div class="image-caption">摄于1984年夏天</div>
                                </div>
                            </div>
                        `,
                        size: '850KB'
                        // id: 'photo',
                        // name: '老照片.jpg',
                        // type: 'file',
                        // description: '一张泛黄的老照片，背面写着：1984年夏',
                        // imageUrl: 'assets/img1.jpg', // 或在线图片URL
                        // size: '850KB'
                    }
                ]
            },
            // 隐藏文件夹 - 需要关键词解锁
            {
                id: 'secret',
                name: '机密文件',
                type: 'folder',
                hidden: true,
                unlockCondition: {
                    type: 'keyword',
                    value: '月光'
                },
                children: [
                    {
                        id: 'secret1',
                        name: '真相.txt',
                        type: 'file',
                        content: '恭喜你找到了第一个隐藏文件！\n\n下一个线索：在回收站里寻找"被遗忘的角落"',
                        size: '1KB'
                    }
                ]
            },
            {
                id: 'trash',
                name: '回收站',
                type: 'folder',
                children: [
                    {
                        id: 'deleted',
                        name: '已删除文件.txt',
                        type: 'file',
                        content: '这个文件应该被清理了，但似乎还留在这里。',
                        size: '1KB'
                    },
                    {
                        id: 'forgotten',
                        name: '被遗忘的角落',
                        type: 'folder',
                        hidden: true,
                        unlockCondition: {
                            type: 'keyword',
                            value: '被遗忘的角落'
                        },
                        children: [
                            {
                                id: 'final',
                                name: '最终线索.txt',
                                type: 'file',
                                content: '最终的秘密就在"1984"这个数字中。\n\n恭喜你完成了所有谜题！',
                                size: '1KB'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// ==================== 关键词系统 ====================
const KeywordSystem = {
    // 关键词与解锁动作的映射
    triggers: {
        '月光': () => {
            showProgressHint('发现了关键词："月光"！隐藏文件夹已解锁。');
            GameState.discoveredKeywords.add('月光');
            GameState.gameProgress += 25;
            renderFileGrid();
        },
        '被遗忘的角落': () => {
            showProgressHint('发现了关键词："被遗忘的角落"！隐藏区域已解锁。');
            GameState.discoveredKeywords.add('被遗忘的角落');
            GameState.gameProgress += 25;
            renderFileGrid();
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
    
    // 处理搜索
    processSearch(keyword) {
        const trimmedKeyword = keyword.trim().toLowerCase();
        
        // 检查是否是预定义的关键词
        if (this.triggers[trimmedKeyword]) {
            this.triggers[trimmedKeyword]();
            return true;
        }
        
        // 检查文件名和内容是否包含关键词
        const results = this.searchInFiles(trimmedKeyword);
        if (results.length > 0) {
            showGameHint(`找到 ${results.length} 个相关文件`);
            return true;
        }
        
        showGameHint('未找到相关内容，但这个关键词听起来有点熟悉...');
        return false;
    },
    
    // 在文件中搜索关键词
    searchInFiles(keyword) {
        const results = [];
        const searchStack = [FileSystem.root];
        
        while (searchStack.length > 0) {
            const current = searchStack.pop();
            
            // 检查文件名
            if (current.name.toLowerCase().includes(keyword)) {
                results.push(current);
            }
            
            // 检查文件内容
            if (current.content && current.content.toLowerCase().includes(keyword)) {
                results.push(current);
            }
            
            // 继续搜索子项目
            if (current.children) {
                searchStack.push(...current.children);
            }
        }
        
        return results;
    }
};

// ==================== UI渲染函数 ====================
function renderBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb-path');
    if (!breadcrumb) return;
    
    let html = '';
    const pathItems = [];
    
    // 构建路径项
    let current = FileSystem.root;
    pathItems.push(current);
    for (let i = 1; i < GameState.currentPath.length; i++) {
        const id = GameState.currentPath[i];
        const folder = current.children?.find(item => item.id === id);
        if (folder) {
            pathItems.push(folder);
            current = folder;
        }
    }
    
    // 生成面包屑HTML
    pathItems.forEach((item, index) => {
        if (index > 0) {
            html += '<span class="separator">›</span>';
        }
        
        if (index === pathItems.length - 1) {
            // 当前位置
            html += `<div class="breadcrumb-item current">
                        <span>${item.name}</span>
                    </div>`;
        } else {
            // 可点击的上级路径
            const pathIds = GameState.currentPath.slice(0, index + 1);
            html += `<div class="breadcrumb-item">
                        <a href="#" data-path='${JSON.stringify(pathIds)}'>${item.name}</a>
                    </div>`;
        }
    });
    
    breadcrumb.innerHTML = html;
}

function renderFileGrid() {
    const fileGrid = document.querySelector('.file-grid');
    if (!fileGrid) return;
    
    const currentFolder = FileSystem.getCurrentFolder();
    if (!currentFolder || !currentFolder.children) {
        fileGrid.innerHTML = '<div class="empty-folder">文件夹为空</div>';
        return;
    }
    
    let html = '';
    
    currentFolder.children.forEach(item => {
        // 检查文件是否应该显示
        if (!FileSystem.shouldShowFile(item)) return;
        
        const iconClass = item.type === 'folder' ? 'folder' : 'text';
        const icon = item.type === 'folder' ? 'fa-folder' : 'fa-file-alt';
        
        html += `
            <div class="file-item ${item.type} ${item.hidden ? 'hidden' : ''}" 
                 data-id="${item.id}" 
                 data-type="${item.type}">
                <div class="file-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="file-name">${item.name}</div>
                ${item.type === 'file' 
                    ? `<div class="file-size">${item.size || '未知大小'}</div>`
                    : `<div class="file-size">${item.children?.length || 0}个项目</div>`
                }
            </div>
        `;
    });
    
    fileGrid.innerHTML = html || '<div class="empty-folder">文件夹为空</div>';
}

// ==================== 模态框管理 ====================
function showFilePreview(file) {
    const template = document.getElementById('file-preview-template');
    const modal = document.importNode(template.content, true);
    
    // 设置模态框内容
    modal.querySelector('.modal-title').textContent = file.name;

    const modalBody = modal.querySelector('.modal-body');

    // 清空模态框内容
    modalBody.innerHTML = '';
    // 检查内容是否包含HTML标签
    if (file.content && (file.content.includes('<') && file.content.includes('>'))) {
        // 是HTML内容，直接插入
        modalBody.innerHTML = file.content;
    } else {
        // 是纯文本内容，创建pre元素显示
        const pre = document.createElement('pre');
        pre.className = 'file-content';
        pre.textContent = file.content || '';
        pre.style.whiteSpace = 'pre-wrap';
        modalBody.appendChild(pre);
    }

    // modal.querySelector('.file-content').textContent = file.content;
    
    // 添加关闭事件
    const closeBtn = modal.querySelector('.close-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
        document.body.removeChild(overlay);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    // 添加ESC键关闭
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);
    
    // 临时存储事件处理器，以便在关闭时移除
    overlay._handleEscape = handleEscape;
    
    document.body.appendChild(modal);
}

// ==================== 提示系统 ====================
function showProgressHint(message) {
    const hint = document.getElementById('progress-hint');
    if (!hint) return;
    
    hint.textContent = message;
    hint.classList.add('show');
    
    setTimeout(() => {
        hint.classList.remove('show');
    }, 3000);
}

function showGameHint(message) {
    const hint = document.getElementById('game-hint');
    if (!hint) return;
    
    hint.querySelector('.hint-content').textContent = message;
    hint.classList.add('show');
    
    setTimeout(() => {
        hint.classList.remove('show');
    }, 5000);
}

// ==================== 导航功能 ====================
function navigateToFolder(folderId) {
    if (folderId === 'root') {
        GameState.currentPath = ['root'];
    } else {
        // 找到文件夹在路径中的位置
        const index = GameState.currentPath.indexOf(folderId);
        if (index > -1) {
            // 如果已经在路径中，跳转到该层级
            GameState.currentPath = GameState.currentPath.slice(0, index + 1);
        } else {
            // 否则添加新路径
            GameState.currentPath.push(folderId);
        }
    }
    
    renderBreadcrumb();
    renderFileGrid();
    GameState.save();
}

// ==================== 事件处理 ====================
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    const performSearch = () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            KeywordSystem.processSearch(keyword);
            searchInput.value = '';
            GameState.save();
        }
    };
    
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // 文件点击事件（使用事件委托）
    document.addEventListener('click', (e) => {
        // 面包屑点击
        if (e.target.closest('.breadcrumb-item a')) {
            e.preventDefault();
            const pathData = e.target.closest('.breadcrumb-item a').dataset.path;
            console.log(pathData);
            const path = JSON.parse(pathData);
            GameState.currentPath = path;
            renderBreadcrumb();
            renderFileGrid();
            GameState.save();
        }
        
        // 文件/文件夹点击
        if (e.target.closest('.file-item')) {
            const fileItem = e.target.closest('.file-item');
            const fileId = fileItem.dataset.id;
            const fileType = fileItem.dataset.type;
            
            const file = FileSystem.getItem(fileId);
            if (!file) return;
            
            if (fileType === 'folder') {
                navigateToFolder(fileId);
            } else {
                showFilePreview(file);
            }
        }
    });
}

// ==================== 初始化应用 ====================
function initializeApp() {
    // 创建应用结构
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="top-bar">
            <div class="logo">神秘网盘</div>
            <div class="search-container">
                <input type="text" id="search-input" class="search-input" placeholder="搜索文件或关键词...">
                <button id="search-btn" class="search-btn">搜索</button>
            </div>
            <div class="progress">进度: <span id="progress-text">0%</span></div>
        </div>
        
        <div class="breadcrumb">
            <div class="breadcrumb-path"></div>
        </div>
        
        <div class="file-grid"></div>
        
        <div class="game-hint" id="game-hint">
            <div class="hint-title">提示</div>
            <div class="hint-content"></div>
        </div>
        
        <div class="progress-hint" id="progress-hint"></div>
    `;
    
    // 加载游戏状态
    const loaded = GameState.load();
    
    // 初始渲染
    renderBreadcrumb();
    renderFileGrid();
    
    // 更新进度显示
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `${GameState.gameProgress}%`;
    }
    
    // 设置事件监听器
    setupEventListeners();
    
    // 如果是新游戏，显示欢迎提示
    if (!loaded) {
        setTimeout(() => {
            showGameHint('欢迎来到神秘网盘解谜游戏！试着搜索一些关键词来发现隐藏内容。');
        }, 1000);
    }
    
    // 自动保存定时器
    setInterval(() => GameState.save(), 30000);
}

// ==================== 启动应用 ====================
// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}