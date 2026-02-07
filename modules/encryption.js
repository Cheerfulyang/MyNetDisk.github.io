// modules/encryption.js - 加密功能
import { GameState } from './game-state.js';

// 创建密码输入模态框
export function createPasswordModal(file) {
    console.log('创建密码模态框 for file:', file.name, file.encryption.hint);
    const template = document.createElement('template');
    template.id = 'password-modal-template';
    template.innerHTML = `
        <div class="modal-overlay password-overlay">
            <div class="modal password-modal">
                <div class="modal-header">
                    <h3 class="modal-title">
                        <i class="fas fa-lock"></i>
                        加密文件: ${file.name}
                    </h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="password-form" data-file-id="${file.id}">
                        <div class="file-info">
                            <div class="file-icon encrypted">
                                <i class="fas fa-file-lock"></i>
                            </div>
                            <div>
                                <p>此文件受密码保护，需要输入密码才能查看内容。</p>
                                ${file.encryption?.hint ? 
                                    `<p class="password-hint"><strong>提示：</strong>${file.encryption.hint}</p>` : 
                                    ''
                                }
                            </div>
                        </div>
                        
                        <div class="attempts-info" id="attempts-info" style="display: none;">
                            <i class="fas fa-exclamation-triangle"></i>
                            剩余尝试次数: <span id="remaining-attempts">3</span>
                        </div>
                        
                        <div class="input-group">
                            <label for="password-input">
                                <i class="fas fa-key"></i> <i class="pwd-input-hint">输入密码123:</i>
                            </label>
                            <input type="password" 
                                   id="password-input" 
                                   class="password-input"
                                   placeholder="请输入密码..."
                                   autocomplete="off">
                            <button id="toggle-password" class="toggle-btn" type="button">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        
                        <div class="button-group">
                            <button id="submit-password" class="btn btn-primary">
                                <i class="fas fa-unlock"></i> 解锁文件
                            </button>
                            <button id="cancel-password" class="btn btn-outline">
                                取消
                            </button>
                        </div>

                        <div id="pwd-hint">
                            <p></p>
                            <div class="pwd-hint-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(template);
}

// 显示密码输入框
export function showPasswordPrompt(file) {
    
    // 先检查文件是否已解密
    if (GameState.isFileDecrypted(file.id)) {
        //已解密
        // 如果是文件直接显示内容
        if (file.type === 'file') {
            import('./file-preview.js').then(module => {
                module.showFilePreview(file);
            });
        }
        if (file.type === 'folder') {
            // 已解密的文件夹直接打开
            import('./navigation.js').then(module => {
                module.navigateToFolder(file.id);
            });
        }
        return;
    }
    
    if (!document.getElementById('pwd-prompt-template')) {
        // 创建并显示密码输入框
        createPasswordModal(file);
    }

    const template = document.getElementById('pwd-prompt-template');
    const modal = document.importNode(template.content, true);

    modal.querySelector('.pwd-file-name').textContent = `加密文件: ${file.name}`;
    modal.querySelector('.password-hint').textContent = `提示：${file.encryption.hint}`;

    // 设置事件监听
    setupPasswordModalEvents(modal, file);
    
    document.body.appendChild(modal);
}

// 设置密码模态框事件
function setupPasswordModalEvents(modal, file) {
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('#cancel-password');
    const submitBtn = modal.querySelector('#submit-password');
    const passwordInput = modal.querySelector('#password-input');
    const toggleBtn = modal.querySelector('#toggle-password');
    const tryKeywordBtn = modal.querySelector('#try-keyword');
    const solvePuzzleBtn = modal.querySelector('#solve-puzzle');
    const overlay = modal.querySelector('.modal-overlay');
    
    // 切换密码显示/隐藏
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            toggleBtn.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // 提交密码
    if (submitBtn && passwordInput) {
        const handleSubmit = () => {
            const password = passwordInput.value.trim();
            if (!password) {
                showPwdHint('请输入密码');
                return;
            }
            
            const success = verifyPassword(file, password);
            
            if (success) {
                closeModal();
                showPwdHint('密码正确！文件已解锁');
                file.encrypted = false;
                // 显示文件内容
                setTimeout(() => {
                    if (file.type === 'file') {
                        import('./file-preview.js').then(module => {
                            module.showFilePreview(file);
                        });
                    }
                    if (file.type === 'folder') {
                        // 已解密的文件夹直接打开
                        import('./navigation.js').then(module => {
                            module.navigateToFolder(file.id);
                        });
                    }
                    // import('./file-preview.js').then(module => {
                    //     module.showFilePreview(file);
                    // });
                }, 500);
            } else {
                
                passwordInput.value = '';
                passwordInput.focus();
                
                showPwdHint(`密码错误，还有5次尝试机会`);
                // if (remaining > 0) {
                //     showGameHint(`密码错误，还有 ${remaining} 次尝试机会`);
                // } else {
                //     showGameHint('文件已被锁定！请稍后再试');
                //     closeModal();
                // }
            }
        };
        
        submitBtn.addEventListener('click', handleSubmit);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSubmit();
        });
    }
    
    // 关闭模态框
    const closeModal = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleEscape);
    };
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', handleEscape);
    
    // 自动聚焦到输入框
    setTimeout(() => {
        if (passwordInput) passwordInput.focus();
    }, 100);
}

// 验证密码
function verifyPassword(file, password) {
    if (!file.encryption) return false;
    
    switch (file.encryption.type) {
        case 'password':
            return password === file.encryption.password;
            
        case 'multi-level':
            return false;
            
        case 'puzzle':
            return password.toLowerCase() === file.encryption.puzzle.answer.toLowerCase();
            
        default:
            return false;
    }
}

function showPwdHint(message) {
    const hint = document.getElementById('pwd-hint');
    if (!hint) return;
    if (hint) {
        hint.innerHTML = message;
    }
}

// 显示锁定文件警告
function showLockedFileAlert(file) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 style="color: #dc3545;">
                    <i class="fas fa-ban"></i> 文件已被锁定
                </h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>安全锁定已启用</strong>
                    <p>由于多次密码尝试失败，此文件已被暂时锁定。</p>
                    <p>请等待一段时间后再尝试，或寻找其他线索。</p>
                </div>
                <div class="lock-info">
                    <p><i class="fas fa-clock"></i> 预计解锁时间: 5分钟后</p>
                    <button id="reset-lock" class="btn btn-outline">
                        <i class="fas fa-sync-alt"></i> 尝试重置锁定
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 重置锁定按钮
    modal.querySelector('#reset-lock')?.addEventListener('click', () => {
        const answer = prompt('要重置锁定，请回答：游戏中的第一个关键词是什么？');
        if (answer === '月光') {
            window.GameState?.resetFileLock?.(file.id);
            document.body.removeChild(modal);
            showPwdHint('锁定已重置，请重试');
        } else {
            showPwdHint('答案不正确，无法重置锁定');
        }
    });
    
    // 关闭按钮
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}