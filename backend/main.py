from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings
from routers import chat, settings as settings_router, auth, models
from database import create_tables

# 创建FastAPI应用
app = FastAPI(
    title="NeuralChat API",
    description="NeuralChat AI对话系统后端API",
    version="2.0.0"
)

# 应用启动时初始化数据库
@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化操作"""
    create_tables()
    print("✅ 数据库表已创建")
    
    # 创建默认管理员账户
    from database import get_db
    from models import User
    from auth import get_password_hash
    
    db = next(get_db())
    try:
        # 检查是否已存在管理员账户
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if not existing_admin:
            admin_user = User(
                username="admin",
                email="admin@example.com",
                full_name="系统管理员",
                hashed_password=get_password_hash("admin123")
            )
            db.add(admin_user)
            db.commit()
            print("✅ 创建默认管理员账户: admin/admin123")
        else:
            print("ℹ️  管理员账户已存在")
    except Exception as e:
        print(f"❌ 创建管理员账户失败: {e}")
    finally:
        db.close()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(chat.router)
app.include_router(settings_router.router)
app.include_router(models.router)

@app.get("/")
async def root():
    """根路径"""
    return JSONResponse({
        "message": "AI对话API服务",
        "version": "1.0.0",
        "status": "running"
    })

@app.get("/health")
async def health_check():
    """健康检查"""
    return JSONResponse({
        "status": "healthy",
        "provider": settings.current_provider,
        "model": settings.current_model
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )