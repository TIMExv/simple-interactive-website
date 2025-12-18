document.addEventListener('DOMContentLoaded', () => {
    // DOM元素
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const submitBtn = document.getElementById('submitBtn');
    const messagesList = document.getElementById('messagesList');
    const visitCount = document.getElementById('visitCount');
    const incrementBtn = document.getElementById('incrementBtn');

    // API基础URL - 适配Render环境
    const API_BASE_URL = window.location.origin + '/api';

    // 初始化函数
    const init = async () => {
        await loadMessages();
        await loadVisitCount();
    };

    // 加载所有留言
    const loadMessages = async () => {
        try {
            showLoading(messagesList);
            const response = await fetch(`${API_BASE_URL}/messages`);
            const messages = await response.json();
            displayMessages(messages);
        } catch (error) {
            showError(messagesList, '加载留言失败，请刷新页面重试');
            console.error('加载留言错误:', error);
        }
    };

    // 显示留言列表
    const displayMessages = (messages) => {
        if (messages.length === 0) {
            messagesList.innerHTML = '<p class="loading">暂无留言，成为第一个留言的人吧！</p>';
            return;
        }

        messagesList.innerHTML = messages.map(message => `
            <div class="message">
                <div class="message-header">
                    <span class="message-name">${escapeHtml(message.name)}</span>
                    <span class="message-time">${formatDate(message.timestamp)}</span>
                </div>
                <div class="message-content">${escapeHtml(message.message)}</div>
            </div>
        `).join('');
    };

    // 提交留言
    const submitMessage = async () => {
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            alert('请填写姓名和留言内容');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '提交中...';

            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '提交失败');
            }

            // 清空输入框
            nameInput.value = '';
            messageInput.value = '';

            // 重新加载留言列表
            await loadMessages();
        } catch (error) {
            alert(`提交失败: ${error.message}`);
            console.error('提交留言错误:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '提交留言';
        }
    };

    // 加载访问计数
    const loadVisitCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/counter`);
            const data = await response.json();
            visitCount.textContent = data.count;
        } catch (error) {
            console.error('加载访问计数错误:', error);
            visitCount.textContent = '?';
        }
    };

    // 增加访问计数
    const incrementCounter = async () => {
        try {
            incrementBtn.disabled = true;
            incrementBtn.textContent = '更新中...';

            const response = await fetch(`${API_BASE_URL}/counter/increment`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('更新失败');
            }

            const data = await response.json();
            visitCount.textContent = data.count;
        } catch (error) {
            console.error('增加访问计数错误:', error);
            alert('更新访问人数失败');
        } finally {
            incrementBtn.disabled = false;
            incrementBtn.textContent = '增加访问人数';
        }
    };

    // 显示加载状态
    const showLoading = (element) => {
        element.innerHTML = '<p class="loading">加载中...</p>';
    };

    // 显示错误信息
    const showError = (element, message) => {
        element.innerHTML = `<div class="error">${message}</div>`;
    };

    // HTML转义，防止XSS攻击
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    };

    // 格式化日期
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins}分钟前`;
        if (diffHours < 24) return `${diffHours}小时前`;
        if (diffDays < 7) return `${diffDays}天前`;

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 事件监听器
    submitBtn.addEventListener('click', submitMessage);
    incrementBtn.addEventListener('click', incrementCounter);

    // 支持回车键提交留言
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    });

    // 初始化应用
    init();
});