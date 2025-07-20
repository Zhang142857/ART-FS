# ART-FS AI对话系统

## 项目简介
ART-FS是一个现代化的AI对话系统，支持多个AI供应商，包含FastAPI后端和React TypeScript前端。

## 技术栈
- **后端**: FastAPI + SQLAlchemy + 加密存储
- **前端**: React + TypeScript + Tailwind CSS
- **AI供应商**: OpenAI、硅基流动、简易API中转、自定义API

## 功能特性
- 🔐 用户认证与授权
- 🤖 多AI供应商支持（4个供应商）
- 💬 实时流式对话
- 📝 Markdown & LaTeX渲染支持
- 🔍 智能模型搜索（518+模型）
- 🎨 响应式UI设计
- 🔒 加密API密钥存储
- 📊 模型分类管理（14个类别）

## 目录结构
```
ART-FS/
├── backend/                 # FastAPI后端
│   ├── main.py             # 主应用入口
│   ├── routers/            # API路由（auth, models, settings, chat）
│   ├── services/           # 业务逻辑
│   ├── models/             # 数据模型
│   └── crypto_utils.py     # 加密工具
├── frontend/               # React前端
│   ├── src/                # 源代码
│   ├── public/             # 静态资源
│   └── package.json
└── GEMINI_优化文档.md      # 前端优化指南
```

## 快速开始

### 后端设置
```bash
cd backend
pip install -r requirements.txt
python main.py
```
默认运行在 http://localhost:8000

### 前端设置
```bash
cd frontend
npm install
npm start
```
默认运行在 http://localhost:3000

## API文档
后端提供完整的RESTful API，包括：
- `/api/auth/*` - 用户认证（注册/登录）
- `/api/models/*` - 模型管理（搜索/分类/测试）
- `/api/settings/*` - 系统设置（供应商配置）
- `/api/chat/*` - 对话功能（流式/非流式）

## 供应商配置
支持的AI供应商：
1. **OpenAI** - https://api.openai.com/v1
2. **硅基流动** - https://api.siliconflow.cn/v1  
3. **简易API中转** - https://jeniya.cn/v1
4. **自定义API** - 用户自定义URL

## 开发状态
- ✅ 后端API完成（模型管理、认证、聊天）
- ✅ 加密存储系统完成
- ✅ 多供应商支持完成
- 🔄 前端优化中（交由Gemini处理）
- 📋 详细优化方案见 `GEMINI_优化文档.md`

## Gemini开发者注意
请仔细阅读 `GEMINI_优化文档.md`，其中包含：
- 完整的后端API调用方法
- 前端问题分析和解决方案
- 优先级任务清单
- 具体实现指导

## 贡献
1. 克隆仓库：`git clone https://github.com/Zhang142857/ART-FS.git`
2. 阅读开发文档：`GEMINI_优化文档.md`
3. 按照优先级完成任务
4. 提交PR