from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import List, Optional
from sqlalchemy.orm import Session
import json
import uuid
from datetime import datetime
from models import (
    ChatRequest, ChatResponse, ModelInfo, ApiResponse, AuthenticatedChatRequest,
    User, ChatSession, MessageRecord, ChatSessionCreate, ChatSessionResponse,
    MessageResponse
)
from services.openai_service import openai_service
from auth import get_optional_user, get_current_active_user
from database import get_db

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/stream")
async def chat_stream(
    request: AuthenticatedChatRequest,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """流式聊天接口（支持用户会话）"""
    try:
        # 获取或创建会话
        session = None
        if user and request.session_id:
            # 查找现有会话
            session = db.query(ChatSession).filter(
                ChatSession.session_id == request.session_id,
                ChatSession.user_id == user.id,
                ChatSession.is_active == True
            ).first()
        
        # 如果用户已登录但没有指定会话，创建新会话
        if user and not session:
            session = ChatSession(
                user_id=user.id,
                title="新对话",
                model_used=request.model or "default"
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        
        # 保存用户消息（如果有会话）
        user_message = None
        if session and request.messages:
            last_message = request.messages[-1]
            if last_message.role == "user":
                user_message = MessageRecord(
                    session_id=session.id,
                    role=last_message.role,
                    content=last_message.content,
                    model_used=request.model or "default"
                )
                db.add(user_message)
                db.commit()
        
        # 准备AI响应
        ai_response_content = ""
        
        async def generate():
            nonlocal ai_response_content
            
            # 发送会话ID（如果有）
            if session:
                yield f"data: {json.dumps({'session_id': session.session_id, 'type': 'session'})}\n\n"
            
            # 处理AI响应
            async for chunk in openai_service.chat_stream(request):
                ai_response_content += chunk
                # 返回SSE格式的数据
                yield f"data: {json.dumps({'content': chunk, 'type': 'content'})}\n\n"
            
            # 保存AI响应（如果有会话）
            if session and ai_response_content.strip():
                ai_message = MessageRecord(
                    session_id=session.id,
                    role="assistant",
                    content=ai_response_content.strip(),
                    model_used=request.model or "default"
                )
                db.add(ai_message)
                db.commit()
                
                # 更新会话的更新时间
                session.updated_at = datetime.utcnow()
                db.commit()
            
            # 发送结束标记
            yield f"data: {json.dumps({'type': 'end'})}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """非流式聊天接口"""
    try:
        content = await openai_service.chat(request)
        return ChatResponse(
            content=content,
            model=request.model or "default",
            finish_reason="stop"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models", response_model=List[ModelInfo])
async def get_models(provider: Optional[str] = None):
    """获取可用模型列表
    
    Args:
        provider: 可选的供应商名称，如果不指定则使用当前供应商
    """
    try:
        models = await openai_service.get_models(provider)
        return [ModelInfo(**model) for model in models]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reload")
async def reload_config():
    """重新加载配置"""
    try:
        openai_service.reload_config()
        return ApiResponse(success=True, message="配置重新加载成功")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== 会话管理API ====================

@router.post("/sessions", response_model=ChatSessionResponse)
async def create_session(
    session_data: ChatSessionCreate,
    user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """创建新的聊天会话"""
    session = ChatSession(
        user_id=user.id,
        title=session_data.title
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return ChatSessionResponse(
        id=session.id,
        session_id=session.session_id,
        user_id=session.user_id,
        title=session.title,
        model_used=session.model_used,
        created_at=session.created_at.isoformat(),
        updated_at=session.updated_at.isoformat() if session.updated_at else None,
        is_active=session.is_active,
        message_count=0
    )

@router.get("/sessions/{session_id}/messages", response_model=List[MessageResponse])
async def get_session_messages(
    session_id: str,
    user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """获取会话的消息历史"""
    # 验证会话所有权
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == user.id,
        ChatSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 获取消息
    messages = db.query(MessageRecord).filter(
        MessageRecord.session_id == session.id
    ).order_by(MessageRecord.timestamp.asc()).all()
    
    return [
        MessageResponse(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            timestamp=msg.timestamp.isoformat(),
            model_used=msg.model_used
        )
        for msg in messages
    ]

@router.put("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session(
    session_id: str,
    session_update: ChatSessionCreate,
    user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """更新聊天会话信息"""
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == user.id,
        ChatSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    session.title = session_update.title
    db.commit()
    db.refresh(session)
    
    # 计算消息数量
    message_count = db.query(MessageRecord).filter(
        MessageRecord.session_id == session.id
    ).count()
    
    return ChatSessionResponse(
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

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """删除聊天会话"""
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == user.id,
        ChatSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")
    
    # 软删除：设置为不活跃
    session.is_active = False
    db.commit()
    
    return ApiResponse(success=True, message="会话已删除")