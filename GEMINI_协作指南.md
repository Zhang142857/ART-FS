# 🤖 Gemini 协作指南 - ART-FS AI对话系统

## 📋 项目概述
GitHub仓库：https://github.com/Zhang142857/ART-FS  
这是一个AI对话系统，后端API已完成，需要Gemini协助优化前端体验。
github token: <REDACTED>
## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/Zhang142857/ART-FS.git
cd ART-FS
```

### 2. 查看项目结构
```bash
ls -la
# 重要文件：
# - GEMINI_优化文档.md  # 详细开发任务
# - README.md           # 项目说明
# - backend/           # 完整的FastAPI后端
# - frontend/          # 需要优化的React前端
```

### 3. 启动开发环境
```bash
# 后端 (已完成，测试用)
cd backend
pip install -r requirements.txt
python main.py  # 运行在 http://localhost:8000

# 前端 (需要你优化)
cd ../frontend
npm install
npm start  # 运行在 http://localhost:3000
```

## 📖 必读文档
**最重要：请先仔细阅读 `GEMINI_优化文档.md`**

该文档包含：
- 🔧 完整的后端API调用方法
- ❌ 前端现有问题详细分析  
- 🎯 按优先级排列的任务清单
- 💻 具体的代码实现指导

## 🎯 你的主要任务

### 优先级1 (立即处理)
1. **修复TypeScript编译错误**
   - 解决react-syntax-highlighter类型问题
   - 确保项目能正常编译运行

2. **重新设计模型选择组件**
   - 现有的下拉菜单搜索功能很差
   - 需要支持518+个模型的高性能搜索
   - 按类别过滤：OpenAI, Claude, Qwen, DeepSeek等14个类别

3. **修复Markdown渲染器**
   - 代码高亮显示不正确
   - LaTeX数学公式渲染失败
   - 添加代码复制功能

### 优先级2 (重要功能)
4. **创建统一设计系统**
   - 当前UI设计不统一，看起来"像一坨"
   - 实现现代化、响应式设计
   - 添加暗色/亮色主题

5. **状态管理重构**
   - 引入Zustand或Redux Toolkit
   - 统一管理用户、聊天、设置状态

## 🔧 后端API使用方法

### 核心API端点
```bash
# 获取模型列表 (支持搜索、分类、分页)
GET http://localhost:8000/api/models/?search=gpt&category=OpenAI&limit=50

# 测试供应商连接
POST http://localhost:8000/api/models/test/openai

# 用户登录
POST http://localhost:8000/api/auth/login
Content-Type: application/x-www-form-urlencoded
username=admin&password=admin123

# 流式聊天
POST http://localhost:8000/api/chat/stream
Authorization: Bearer <token>
{
  "messages": [{"role": "user", "content": "你好"}],
  "model": "gpt-3.5-turbo"
}
```

### API响应格式
```json
{
  "success": true,
  "message": "成功获取 518 个模型",
  "data": {
    "models": [
      {
        "id": "gpt-4o",
        "name": "gpt-4o",
        "provider": "openai", 
        "category": "OpenAI",
        "description": "OpenAI - gpt-4o"
      }
    ],
    "categories": {
      "OpenAI": 15,
      "Claude": 8,
      "Qwen": 45
    }
  }
}
```

## 🛠️ 技术要求

### 必须使用的技术栈
- **React 18** + **TypeScript**
- **Tailwind CSS** (或其他现代CSS框架)
- **React Router** (路由管理)
- **Zustand** 或 **Redux Toolkit** (状态管理)

### 推荐的库
```json
{
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0", 
  "remark-math": "^6.0.0",
  "rehype-katex": "^7.0.0",
  "react-syntax-highlighter": "^15.5.0",
  "zustand": "^4.4.0",
  "axios": "^1.6.0"
}
```

## 📝 开发流程

### 1. 创建分支
```bash
git checkout -b feature/frontend-optimization
```

### 2. 按优先级开发
- 先解决TypeScript错误，确保项目能运行
- 然后按 `GEMINI_优化文档.md` 中的优先级顺序开发
- 每完成一个功能就提交一次

### 3. 提交代码
```bash
git add .
git commit -m "feat: 优化模型选择组件，支持高性能搜索"
git push origin feature/frontend-optimization
```

### 4. 创建Pull Request
- 提交PR到main分支
- 详细描述你解决的问题和实现的功能

## 🚨 重要注意事项

### 关于后端
- ✅ **后端API已完成，不需要修改**
- ✅ 支持4个AI供应商：OpenAI、硅基流动、简易API中转、自定义
- ✅ 已实现模型分类、搜索、加密存储等功能
- 📋 后端默认账户：admin/admin123

### 关于前端
- ❌ 当前前端代码质量较差，需要大幅重构
- ❌ UI设计不统一，用户体验差
- ❌ 模型搜索功能实现简陋
- ❌ Markdown渲染有严重问题

### 性能要求
- 🚀 模型列表可能有518+条目，必须考虑虚拟化渲染
- 🚀 搜索功能要支持实时过滤，延迟<100ms
- 🚀 页面加载时间要控制在2秒内

## 🔍 测试方法

### 功能测试
1. **模型搜索测试**
   ```bash
   # 测试搜索"gpt"，应该快速返回相关模型
   # 测试按类别过滤"OpenAI"
   # 测试分页功能
   ```

2. **Markdown渲染测试**
   ```markdown
   # 测试代码块
   ```python
   def hello():
       print("Hello World")
   ```
   
   # 测试数学公式
   $E = mc^2$
   
   $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$
   ```

3. **流式聊天测试**
   - 测试消息实时显示
   - 测试错误处理
   - 测试重连机制

## 💡 额外建议

### UI/UX改进
- 参考 ChatGPT、Claude 等现代AI聊天界面
- 实现平滑的动画和过渡效果
- 添加键盘快捷键支持
- 优化移动端体验

### 代码质量
- 组件要拆分合理，单一职责
- 添加PropTypes或TypeScript接口
- 统一错误处理和加载状态
- 添加单元测试

## 📞 问题反馈
如果在开发过程中遇到问题：
1. 检查 `GEMINI_优化文档.md` 是否有解答
2. 查看后端API文档和示例
3. 在GitHub Issues中提问

## 🎉 期望成果
完成后的前端应该是：
- ✨ 现代化、美观的用户界面
- 🚀 高性能的模型搜索和选择
- 📝 完美的Markdown/LaTeX渲染
- 📱 优秀的响应式设计
- 🔧 稳定可靠的功能实现

**开始之前，请务必完整阅读 `GEMINI_优化文档.md`！**

祝开发顺利！ 🚀
