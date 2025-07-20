#!/bin/bash

echo "🚀 启动 NeuralChat 应用..."

# 检查是否在正确目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 启动后端
echo "📡 启动后端服务器..."
cd backend
source venv/bin/activate
nohup uvicorn main:app --reload --host 0.0.0.0 --port 8001 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端服务器已启动 (PID: $BACKEND_PID, 端口: 8001)"

# 等待后端启动
sleep 3

# 启动前端
echo "🌐 启动前端服务器..."
cd ../frontend
nohup npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端服务器已启动 (PID: $FRONTEND_PID, 端口: 3000)"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."

# 检查后端
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✅ 后端API正常运行"
else
    echo "❌ 后端API启动失败"
fi

# 检查前端
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 前端应用正常运行"
else
    echo "❌ 前端应用启动失败"
fi

echo ""
echo "🎉 NeuralChat 启动完成！"
echo "📱 前端访问地址: http://localhost:3000"
echo "🔧 后端API地址: http://localhost:8001"
echo "📋 API文档: http://localhost:8001/docs"
echo ""
echo "📝 查看日志："
echo "   后端日志: tail -f backend.log"
echo "   前端日志: tail -f frontend.log"
echo ""
echo "🛑 停止服务："
echo "   pkill -f uvicorn"
echo "   pkill -f react-scripts"