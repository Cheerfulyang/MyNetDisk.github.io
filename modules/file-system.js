// modules/file-system.js - 文件系统数据
export const FileSystem = {
    root: {
        id: 'root',
        name: '我的文件',
        type: 'folder',
        children: [
            {
                id: 'work',
                name: '工作',
                type: 'folder',
                children: [
                    {
                        id: 'Schedule',
                        name: '日程安排',
                        type: 'folder',
                        children: [
                            {
                                id: 'report2',
                                name: '周报.txt',
                                type: 'file',
                                date: '创建时间:2026-01-07  修改时间:2026-01-07',
                                content: '本周工作正常进行中。\n明天需要提交季度总结。',
                                size: '2KB'
                            },
                            {
                                id: 'meeting2',
                                name: '会议记录.txt',
                                type: 'file',
                                date: '创建时间:2026-01-07  修改时间:2026-01-07',
                                content: '会议主题：项目进展\n\n讨论了关于新功能开发的时间表。\n备注：密码可能藏在日常用语中。',
                                size: '5KB'
                            }
                        ]
                    },
                    {
                        id: 'report',
                        name: '周报.txt',
                        type: 'file',
                        date: '创建时间:2026-01-07  修改时间:2026-01-07',
                        content: '本周工作正常进行中。\n明天需要提交季度总结。',
                        size: '2KB'
                    },
                    {
                        id: 'meeting',
                        name: '会议记录.txt',
                        type: 'file',
                        date: '创建时间:2026-01-07  修改时间:2026-01-07',
                        content: '会议主题：项目进展\n\n讨论了关于新功能开发的时间表。\n备注：密码可能藏在日常用语中。',
                        size: '5KB'
                    }
                ]
            },
            {
                id: 'personal',
                name: '家庭',
                type: 'folder',
                children: [
                    {
                        id: 'photos',
                        name: '照片集',
                        type: 'folder',
                        children: [
                            {
                                id: 'travel',
                                name: '香山旅行.jpg',
                                type: 'file',
                                content: `
                                    <div class="image-description">
                                        <div class="image-container">
                                            <img src="assets/travel.jpg" alt="泛黄的老照片" class="old-photo" width="600">
                                        </div>
                                    </div>
                                `,
                                size: '850KB'
                            },
                            {
                                id: 'photo',
                                name: '老照片.jpg',
                                type: 'file',
                                date: '创建时间:2026-01-07  修改时间:2026-01-07',
                                content: `
                                    <div class="image-description">
                                        <p>一张泛黄的老照片，背面写着：1984年夏</p>
                                        <div class="image-container">
                                            <img src="assets/img1.png" alt="泛黄的老照片" class="old-photo" width="100">
                                            <div class="image-caption">摄于1984年夏天</div>
                                        </div>
                                    </div>
                                `,
                                size: '850KB'
                            }
                        ]
                    },
                    {
                        id: 'notes',
                        name: '笔记.txt',
                        type: 'file',
                        date: '创建时间:2026-01-07  修改时间:2026-01-07',
                        content: '突然想起小时候的暗号："月光下的约定"\n这个好像可以用来解锁什么...',
                        size: '3KB'
                    }
                ]
            },
            {
                id: 'dairy',
                name: '日记',
                type: 'folder',
                children: [
                    // 隐藏文件夹 - 需要关键词解锁
                    {
                        id: 'secret',
                        name: '机密文件',
                        type: 'folder',
                        hidden: true,
                        unlockCondition: {
                            type: 'keyword',
                            value: ['月光', '月光2']
                        },
                        encrypted: true,          // 标记为加密文件
                        encryption: {
                            type: 'password',     // 加密类型：密码
                            password: '123456', // 密码（实际应该加密存储）
                            hint: '机密文件提示',     // 密码提示
                            attempts: 0,          // 尝试次数
                            locked: false         // 是否已锁定
                        },
                        children: [
                            {
                                id: 'secret1',
                                name: '真相.txt',
                                type: 'file',
                                date: '创建时间:2026-01-07  修改时间:2026-01-07',
                                content: '恭喜你找到了第一个隐藏文件！\n\n下一个线索：在回收站里寻找"被遗忘的角落"',
                                size: '1KB'
                            }
                        ]
                    },
                    {
                        id: 'secret_diary',
                        name: '日记1.txt',
                        type: 'file',
                        date: '创建时间:2026-01-07  修改时间:2026-01-07',
                        encrypted: true,          // 标记为加密文件
                        encryption: {
                            type: 'password',     // 加密类型：密码
                            password: '123', // 密码（实际应该加密存储）
                            hint: '我的生日',     // 密码提示
                            attempts: 0,          // 尝试次数
                            locked: false         // 是否已锁定
                        },
                        content: `
                            <div class="secret-content">
                                <h3>📖 秘密日记</h3>
                                <p>2023年10月1日</p>
                                <p>今天发现了一个惊人的秘密...</p>
                                <p>原来这一切的背后竟然是...</p>
                                <div class="clue-box">
                                    <strong>重要线索：</strong>
                                    <p>下一个密码藏在"月光"文件夹中</p>
                                </div>
                            </div>
                        `,
                        originalContent: '真实内容在这里...', // 解密后的实际内容
                        size: '12KB'
                    },
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
                        date: '创建时间:2026-01-06  修改时间:2026-01-07',
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
                            value: ['被遗忘的角落']
                        },
                        children: [
                            {
                                id: 'final',
                                name: '最终线索.txt',
                                type: 'file',
                                date: '创建时间:2026-01-07  修改时间:2026-01-07',
                                hidden: true,
                                unlockCondition: {
                                    type: 'keyword',
                                    value: ['最终线索']
                                },
                                content: '最终的秘密就在"1984"这个数字中。\n\n恭喜你完成了所有谜题！',
                                size: '1KB'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'introduction',
                name: '网盘使用说明.txt',
                type: 'file',
                date: '创建时间:2026-01-07  修改时间:2026-01-07',
                content: `
                            <div>
                                <h3>费米网盘使用说明</h3>
                                <p>欢迎使用费米网盘！这是一个模拟云端存储的互动游戏。</p>
                                <p>在这里，你可以通过搜索关键词来解锁隐藏的文件和秘密。试着探索不同的文件夹，寻找线索，完成谜题吧！</p>
                                <h3>搜索功能使用说明:</h3>
                                <p>在搜索栏输入关键词，如"爸爸"，看看会发生什么！</p>
                            </div>
                        `,
                originalContent: '真实内容在这里...', // 解密后的实际内容
                size: '12KB'
            },
        ]
    },
    
    getItem(id) {
        return this._findItem(id, this.root);
    },
    
    getCurrentFolder() {
        let current = this.root;
        for (let i = 1; i < GameState.currentPath.length; i++) {
            const id = GameState.currentPath[i];
            if (current.children) {
                current = current.children.find(item => item.id === id) || current;
            }
        }
        return current;
    },
    
    shouldShowFile(file) {
        if (!file.hidden) return true;
        
        if (file.unlockCondition) {
            if (file.unlockCondition.type === 'keyword') {
                // return GameState.discoveredKeywords.has(file.unlockCondition.value);
                return file.unlockCondition.value.some(keyword => GameState.discoveredKeywords.has(keyword))
            }
            if (file.unlockCondition.type === 'progress') {
                return GameState.gameProgress >= file.unlockCondition.value;
            }
        }
        return false;
    },
    
    _findItem(id, currentNode) {
        if (currentNode.id === id) return currentNode;
        
        if (currentNode.children) {
            for (const child of currentNode.children) {
                const found = this._findItem(id, child);
                if (found) return found;
            }
        }
        return null;
    }
};

// 导入GameState用于依赖
import { GameState } from './game-state.js';