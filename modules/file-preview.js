// modules/file-preview.js - 文件预览
import { GameState } from './game-state.js';


export function showFilePreview(file) {
    // console.log('尝试预览文件:', file);
    // 检查是否是加密文件
    if (file.encrypted && !GameState.isFileDecrypted(file.id)) {
        // 显示密码输入框
        import('./encryption.js').then(module => {
            module.showPasswordPrompt(file);
        });
        return;
    }

    if (!document.getElementById('file-preview-template')) {
        createPreviewTemplate();
    }
    
    const template = document.getElementById('file-preview-template');
    const modal = document.importNode(template.content, true);
    
    modal.querySelector('.modal-title').textContent = file.name;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = createFilePreviewContent(file);
    
    // 设置关闭功能
    const closeBtn = modal.querySelector('.close-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleEscape);
    };
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', handleEscape);
    document.body.appendChild(modal);
}

function createFilePreviewContent(file) {
    if (!file.content) return '<p>文件内容为空</p>';
    
    const content = file.content.trim();
    const isHTML = /^<[\s\S]*>$/m.test(content) && content.includes('<') && content.includes('>');
    
    if (isHTML) {
        return content;
    } else {
        const escapedContent = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        const withBreaks = escapedContent.replace(/\n/g, '<br>');
        return `<div class="text-content"><p style="white-space: pre-wrap;">${withBreaks}</p></div>`;
    }
}

function createPreviewTemplate() {
    const template = document.createElement('template');
    template.id = 'file-preview-template';
    
    template.innerHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(template);
}