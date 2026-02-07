// modules/ui-render.js - UI渲染
import { GameState } from './game-state.js';
import { FileSystem } from './file-system.js';

export function initializeApp() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
        <div class="logo">
            <i class="fas fa-cloud"></i>
            <h1>云端网盘</h1>
            <div class="spacer"></div>
            <div class="nav-actions">
                <button id="back-btn" class="nav-btn" title="返回上一级">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <button id="reset-btn" class="nav-btn" title="重置游戏">
                    <i class="fas fa-redo"></i>
                </button>
                <div class="progress">进度: <span id="progress-text">0%</span></div>
            </div>
        </div>
        <div class="top-bar">
            <div class="account-info">
                <div class="account-avatar">
                    <img src="assets/headicon.png" 
                         alt="用户头像"
                         class="avatar-img">
                    <div class="avatar-status"></div>
                </div>
                <div class="account-details">
                    <div class="account-name">
                        <h3>linche1993</h3>
                        <span class="account-badge premium">
                            <i class="fas fa-crown"></i> SVIP
                        </span>
                    </div>
                    <div class="storage-info">
                        <div class="storage-progress">
                            <div class="storage-bar">
                                <div class="storage-fill" style="width: 78.4%"></div>
                                <div class="storage-marker" style="left: 50%">
                                    <div class="marker-tooltip">普通会员上限: 100 GB</div>
                                </div>
                            </div>
                        </div>
                        <div class="storage-header">
                            <span class="storage-used">已用 156.8 GB / 200 GB</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-container">
                <input type="text" id="search-input" class="search-input" placeholder="搜索文件或关键词...">
                <button id="search-btn" class="search-btn">搜索</button>
            </div>
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
    
    updateUI();
}

export function updateUI() {
    renderBreadcrumb();
    renderFileGrid();
    updateProgressDisplay();
    updateBackButton();
}

export function renderSearchResults() {
    renderSearchBreadcrumb();
    renderSearchFileGrid();
}

function renderSearchBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb-path');
    if (!breadcrumb) return;
    
    let html = '';
    //"添加root"
    html += `<div class="breadcrumb-item">
                        <a href="#" data-path='["root"]'>${'我的文件'}</a>
                    </div>`;
    html += '<span class="separator">›</span>';
    html += `<div class="breadcrumb-item current"><span>${'搜索结果'}</span></div>`;
    
    breadcrumb.innerHTML = html;
}

// 渲染搜索结果
function renderSearchFileGrid() {
    const fileGrid = document.querySelector('.file-grid');
    if (!fileGrid) return;
    
    const searchResults = GameState.searchResults;
    
    if (searchResults.length === 0) {
        fileGrid.innerHTML = `
            <div class="empty-search">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3>没有找到匹配的内容</h3>
                <p>试试其他关键词，或者查看"帮助"获取线索提示</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    searchResults.forEach(item => {
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
                <div class="file-actions">
                    <span class="file-action-btn"><i class="fas fa-ellipsis-h"></i></span>
                </div>
            </div>
        `;
    });
    
    fileGrid.innerHTML = html || '<div class="empty-folder">文件夹为空</div>';
}

export function renderBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb-path');
    if (!breadcrumb) return;
    
    let html = '';
    const pathItems = [];
    let current = FileSystem.root;
    pathItems.push(current);
    
    for (let i = 1; i < GameState.currentPath.length; i++) {
        const id = GameState.currentPath[i];
        if (current.children) {
            const nextItem = current.children.find(item => item.id === id);
            if (nextItem) {
                pathItems.push(nextItem);
                current = nextItem;
            }
        }
    }
    
    pathItems.forEach((item, index) => {
        if (index > 0) html += '<span class="separator">›</span>';
        
        if (index === pathItems.length - 1) {
            html += `<div class="breadcrumb-item current"><span>${item.name}</span></div>`;
        } else {
            const pathIds = GameState.currentPath.slice(0, index + 1);
            html += `<div class="breadcrumb-item">
                        <a href="#" data-path='${JSON.stringify(pathIds)}'>${item.name}</a>
                    </div>`;
            console.log('Breadcrumb link added for', JSON.stringify(pathIds));
        }
    });
    
    breadcrumb.innerHTML = html;
}

export function renderFileGrid() {
    const fileGrid = document.querySelector('.file-grid');
    if (!fileGrid) return;
    
    const currentFolder = FileSystem.getCurrentFolder();
    if (!currentFolder || !currentFolder.children) {
        fileGrid.innerHTML = '<div class="empty-folder">文件夹为空</div>';
        return;
    }
    
    let html = '';
    
    currentFolder.children.forEach(item => {
        if (!FileSystem.shouldShowFile(item)) return;
        
        const isEncrypted = item.encrypted && !GameState.isFileDecrypted(item.id);
        const iconClass = item.type === 'folder' ? 'folder' : 'text';
        const icon = item.type === 'folder' ? 'fa-folder' : 'fa-file-alt';
        
        html += `
            <div class="file-item ${item.type} ${item.hidden ? 'hidden' : ''}" 
                 data-id="${item.id}" 
                 data-type="${item.type}">
                <div class="file-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="file-name">
                    ${item.name}
                    ${isEncrypted ? '<span class="encrypted-badge"><i class="fas fa-lock"></i></span>' : ''}
                </div>

                <div class="file-actions">
                    ${item.type === 'file' 
                        ? `<span class="file-size">${item.size || '未知大小'}</span>`
                        : `<span class="file-size">${item.children?.length || 0}个项目</span>`
                    }
                    <span class="file-action-btn"><i class="fas fa-ellipsis-h"></i></span>
                </div>
            </div>
        `;
    });
    
    fileGrid.innerHTML = html || '<div class="empty-folder">文件夹为空</div>';
}

function updateProgressDisplay() {
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `${GameState.gameProgress}%`;
    }
}

function updateBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.disabled = GameState.currentPath.length <= 1;
    }
}

// 提示系统
export function showProgressHint(message) {
    const hint = document.getElementById('progress-hint');
    if (!hint) return;
    
    hint.textContent = message;
    hint.classList.add('show');
    
    setTimeout(() => hint.classList.remove('show'), 3000);
}

export function showGameHint(message) {
    const hint = document.getElementById('game-hint');
    if (!hint) return;
    
    hint.querySelector('.hint-content').textContent = message;
    hint.classList.add('show');
    
    setTimeout(() => hint.classList.remove('show'), 2000);
}