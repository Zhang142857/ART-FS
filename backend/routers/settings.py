from fastapi import APIRouter, HTTPException
from models import Settings, SettingsUpdateRequest, ApiResponse
from config import settings, PROVIDERS, update_provider_secure_config
from services.openai_service import openai_service
from crypto_utils import secure_storage
import os
from pathlib import Path

router = APIRouter(prefix="/api/settings", tags=["settings"])

def _update_env_file():
    """更新.env文件"""
    env_path = Path(__file__).parent.parent / ".env"
    
    # 读取现有的.env文件内容
    lines = []
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    
    # 创建键值对映射
    env_dict = {}
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, value = line.split('=', 1)
            env_dict[key.strip()] = value.strip()
    
    # 更新配置值
    env_dict['CURRENT_PROVIDER'] = settings.current_provider
    env_dict['CURRENT_MODEL'] = settings.current_model
    
    # 更新API keys
    if hasattr(settings, 'openai_api_key') and settings.openai_api_key:
        env_dict['OPENAI_API_KEY'] = settings.openai_api_key
    if hasattr(settings, 'provider2_api_key') and settings.provider2_api_key:
        env_dict['PROVIDER2_API_KEY'] = settings.provider2_api_key
    if hasattr(settings, 'custom_api_key') and settings.custom_api_key:
        env_dict['CUSTOM_API_KEY'] = settings.custom_api_key
    if hasattr(settings, 'custom_base_url') and settings.custom_base_url:
        env_dict['CUSTOM_BASE_URL'] = settings.custom_base_url
    
    # 写回文件，保持原有的注释和结构
    with open(env_path, 'w', encoding='utf-8') as f:
        current_section = None
        for line in lines:
            if line.strip().startswith('#'):
                # 保持注释行
                f.write(line)
                current_section = line.strip()
            elif '=' in line and not line.strip().startswith('#'):
                # 更新配置行
                key = line.split('=', 1)[0].strip()
                if key in env_dict:
                    f.write(f"{key}={env_dict[key]}\n")
                else:
                    f.write(line)
            else:
                # 保持空行
                f.write(line)

@router.get("/", response_model=Settings)
async def get_settings():
    """获取当前设置"""
    try:
        return Settings(
            current_provider=settings.current_provider,
            current_model=settings.current_model,
            max_tokens=None,
            providers={}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/providers")
async def get_providers():
    """获取可用的供应商列表"""
    try:
        providers = {}
        secure_providers = secure_storage.list_providers()
        
        for key, provider in PROVIDERS.items():
            # 检查加密存储中是否有配置
            is_configured = key in secure_providers and secure_providers[key]['configured']
            
            # 如果加密存储中没有，检查环境变量（向后兼容）
            if not is_configured:
                is_configured = bool(getattr(settings, provider["api_key_field"], None))
            
            providers[key] = {
                "name": provider["name"],
                "base_url": provider["base_url"],
                "configured": is_configured
            }
        return ApiResponse(success=True, message="获取供应商列表成功", data=providers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/")
async def update_settings(request: SettingsUpdateRequest):
    """更新设置"""
    try:
        # 更新设置
        if request.current_provider:
            settings.current_provider = request.current_provider
        if request.current_model:
            settings.current_model = request.current_model
        if request.max_tokens is not None:
            # 这里可以保存到配置文件或数据库
            pass
        
        # 如果提供了API key或base_url，使用加密存储
        if request.api_key or request.base_url:
            provider = PROVIDERS.get(settings.current_provider)
            if provider:
                # 使用加密存储保存配置
                success = update_provider_secure_config(
                    settings.current_provider, 
                    request.api_key, 
                    request.base_url
                )
                
                if not success:
                    raise HTTPException(status_code=500, detail="保存加密配置失败")
                
                # 为了向后兼容，也更新环境变量（但优先使用加密存储）
                if request.api_key:
                    setattr(settings, provider["api_key_field"], request.api_key)
                    
                if request.base_url and settings.current_provider == "custom":
                    settings.custom_base_url = request.base_url
        
        # 重新加载OpenAI服务配置
        openai_service.reload_config()
        
        # 持久化基本设置到.env文件
        _update_env_file()
        
        return ApiResponse(success=True, message="设置更新成功")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test")
async def test_api_connection():
    """测试API连接并获取模型列表"""
    try:
        # 获取当前供应商并尝试获取其模型列表
        current_provider = settings.current_provider
        models = await openai_service.get_models(current_provider)
        
        if models:
            # 统计模型类别
            categories = {}
            for model in models:
                category = model.get('category', 'Other')
                categories[category] = categories.get(category, 0) + 1
            
            return ApiResponse(
                success=True, 
                message=f"API连接测试成功，找到 {len(models)} 个模型",
                data={
                    "models": models,
                    "total_count": len(models),
                    "categories": categories
                }
            )
        else:
            return ApiResponse(
                success=True,
                message="API连接成功，但无法获取模型列表。请手动输入模型ID。",
                data={"models": [], "total_count": 0, "categories": {}}
            )
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"API连接测试失败: {str(e)}",
            data={"models": [], "total_count": 0, "categories": {}}
        )