from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import (
    User, UserCreate, UserLogin, UserResponse, UserUpdate, 
    Token, ChatSession, ChatSessionResponse, UserRole
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_active_user, get_user_by_username, get_user_by_email,
    get_current_admin_user, check_admin_permission,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

@router.post("/register", response_model=Token, summary="用户注册")
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    用户注册接口
    
    - **username**: 用户名（唯一）
    - **email**: 邮箱地址（唯一）
    - **password**: 密码
    - **full_name**: 全名（可选）
    """
    # 检查用户名是否已存在
    if get_user_by_username(db, user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 检查邮箱是否已存在
    if get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱地址已注册"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 生成访问令牌
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username},
        expires_delta=access_token_expires
    )
    
    # 创建用户响应对象
    user_response = UserResponse(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        full_name=db_user.full_name,
        is_active=db_user.is_active,
        created_at=db_user.created_at.isoformat()
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )

@router.post("/login", response_model=Token, summary="用户登录")
async def login_user(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    用户登录接口
    
    - **username**: 用户名
    - **password**: 密码
    """
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 生成访问令牌
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    # 创建用户响应对象
    user_response = UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=user.created_at.isoformat()
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_response
    )

@router.get("/me", response_model=UserResponse, summary="获取当前用户信息")
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """获取当前登录用户的信息"""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat()
    )

@router.put("/me", response_model=UserResponse, summary="更新用户信息")
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """更新当前登录用户的信息"""
    
    # 检查邮箱是否已被其他用户使用
    if user_update.email and user_update.email != current_user.email:
        existing_user = get_user_by_email(db, user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="邮箱地址已被使用"
            )
    
    # 更新用户信息
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.email is not None:
        current_user.email = user_update.email
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at.isoformat()
    )

@router.get("/sessions", response_model=list[ChatSessionResponse], summary="获取用户的聊天会话列表")
async def get_user_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取当前用户的所有聊天会话"""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id,
        ChatSession.is_active == True
    ).order_by(ChatSession.updated_at.desc()).all()
    
    session_responses = []
    for session in sessions:
        # 计算消息数量
        message_count = len(session.messages)
        
        session_response = ChatSessionResponse(
            id=session.id,
            session_id=session.session_id,
            user_id=session.user_id,
            title=session.title,
            model_used=session.model_used,
            created_at=session.created_at.isoformat(),
            updated_at=session.updated_at.isoformat() if session.updated_at else None,
            is_active=session.is_active,
            message_count=message_count
        )
        session_responses.append(session_response)
    
    return session_responses

@router.post("/logout", summary="用户登出")
async def logout_user():
    """
    用户登出接口
    
    注意：由于使用JWT令牌，服务端无法主动使令牌失效。
    客户端应该删除本地存储的令牌。
    """
    return {"message": "登出成功，请删除本地令牌"}

@router.get("/users", response_model=list[UserResponse], summary="获取所有用户（管理员）")
async def get_all_users(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """获取所有用户列表（仅管理员可访问）"""
    users = db.query(User).all()
    
    user_responses = []
    for user in users:
        user_response = UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at.isoformat()
        )
        user_responses.append(user_response)
    
    return user_responses

@router.put("/users/{user_id}/role", summary="更新用户角色（管理员）")
async def update_user_role(
    user_id: int,
    role: UserRole,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """更新用户角色（仅管理员可访问）"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 防止管理员将自己降级为普通用户
    if user.id == current_user.id and role == UserRole.USER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无法将自己降级为普通用户"
        )
    
    user.role = role
    db.commit()
    db.refresh(user)
    
    return {"message": f"用户 {user.username} 的角色已更新为 {role}"}

@router.put("/users/{user_id}/status", summary="更新用户状态（管理员）")  
async def update_user_status(
    user_id: int,
    is_active: bool,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """更新用户状态（仅管理员可访问）"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    # 防止管理员禁用自己的账户
    if user.id == current_user.id and not is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无法禁用自己的账户"
        )
    
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    
    status_text = "启用" if is_active else "禁用"
    return {"message": f"用户 {user.username} 已{status_text}"}

@router.get("/check-admin", summary="检查管理员权限")
async def check_admin_status(
    current_user: User = Depends(get_current_active_user)
):
    """检查当前用户是否为管理员"""
    return {
        "is_admin": current_user.role == UserRole.ADMIN,
        "role": current_user.role,
        "username": current_user.username
    }