from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    stream: bool = True
    max_tokens: Optional[int] = None

class ChatResponse(BaseModel):
    content: str
    model: str
    finish_reason: Optional[str] = None

class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    description: Optional[str] = None

class ProviderConfig(BaseModel):
    name: str
    api_key: str
    base_url: str
    models: List[str] = []

class Settings(BaseModel):
    current_provider: str = "openai"
    current_model: str = "gpt-3.5-turbo"
    max_tokens: Optional[int] = None
    providers: Dict[str, ProviderConfig] = {}

class SettingsUpdateRequest(BaseModel):
    current_provider: Optional[str] = None
    current_model: Optional[str] = None
    max_tokens: Optional[int] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

# ==================== SQLAlchemy数据库模型 ====================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="user", nullable=False)  # 用户角色
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), default="新对话")
    model_used = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # 关系
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("MessageRecord", back_populates="chat_session", cascade="all, delete-orphan")

class MessageRecord(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    model_used = Column(String(100), nullable=True)
    token_count = Column(Integer, nullable=True)
    
    # 关系
    chat_session = relationship("ChatSession", back_populates="messages")

# ==================== 用户相关Pydantic模型 ====================

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: str
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None

# ==================== 聊天会话相关Pydantic模型 ====================

class ChatSessionBase(BaseModel):
    title: str

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionResponse(ChatSessionBase):
    id: int
    session_id: str
    user_id: int
    model_used: Optional[str]
    created_at: str
    updated_at: Optional[str]
    is_active: bool
    message_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class ChatSessionUpdate(BaseModel):
    title: Optional[str] = None
    is_active: Optional[bool] = None

# ==================== 消息相关Pydantic模型 ====================

class MessageCreate(BaseModel):
    role: MessageRole
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: str
    model_used: Optional[str]
    
    class Config:
        from_attributes = True

# ==================== 扩展的聊天请求模型 ====================

class AuthenticatedChatRequest(ChatRequest):
    session_id: Optional[str] = None  # 如果提供，则使用现有会话；否则创建新会话