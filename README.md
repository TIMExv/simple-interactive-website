# 简单动态网站项目

这是一个包含前后端交互的简单动态网站项目。

## 项目结构

- `backend/` - 后端服务器代码
  - `server.js` - Express.js 服务器
  - `package.json` - 后端依赖配置
- `frontend/` - 前端页面代码
  - `index.html` - 主页面
  - `style.css` - 样式文件
  - `script.js` - 前端交互逻辑

## 功能特性

- 留言板功能
- 访问计数器
- 响应式设计
- 前后端数据交互

## 如何运行

1. 安装后端依赖：
   ```bash
   cd backend
   npm install
   ```

2. 启动后端服务器：
   ```bash
   npm start
   ```

3. 在浏览器中打开 `frontend/index.html` 文件

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：Node.js, Express.js
- 数据交互：RESTful API