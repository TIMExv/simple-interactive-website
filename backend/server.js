const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 内存数据存储（实际项目中应使用数据库）
let messages = [];
let visitCount = 0;

// API路由

// 获取所有留言
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

// 添加新留言
app.post('/api/messages', (req, res) => {
    const { name, message } = req.body;
    
    if (!name || !message) {
        return res.status(400).json({ error: '姓名和留言内容不能为空' });
    }
    
    const newMessage = {
        id: Date.now(),
        name,
        message,
        timestamp: new Date().toISOString()
    };
    
    messages.unshift(newMessage); // 新留言添加到开头
    res.status(201).json(newMessage);
});

// 获取访问计数
app.get('/api/counter', (req, res) => {
    res.json({ count: visitCount });
});

// 增加访问计数
app.post('/api/counter/increment', (req, res) => {
    visitCount++;
    res.json({ count: visitCount });
});

// 默认路由，返回前端页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});