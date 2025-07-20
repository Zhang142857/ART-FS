from pydantic_settings import BaseSettings
from typing import Optional
import os
from crypto_utils import secure_storage

class Settings(BaseSettings):
    # API配置
    openai_api_key: Optional[str] = None
    openai_base_url: str = "https://api.openai.com/v1"
    
    # 硅基流动配置
    siliconflow_api_key: Optional[str] = None
    siliconflow_base_url: str = "https://api.siliconflow.cn/v1"
    
    # 简易API中转配置
    simple_api_key: Optional[str] = None
    simple_api_base_url: str = "https://jeniya.cn/v1"
    
    # 兼容API提供商配置
    provider2_api_key: Optional[str] = None
    provider2_base_url: str = "https://api.openai.com/v1"
    
    # 自定义API配置
    custom_api_key: Optional[str] = None
    custom_base_url: str = "https://api.openai.com/v1"
    
    # 当前使用的供应商
    current_provider: str = "openai"
    current_model: str = "gpt-3.5-turbo"
    
    # 服务器配置
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # JWT认证配置
    secret_key: str = "neural-chat-super-secret-key-change-in-production-2025"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 43200  # 30天
    
    # CORS配置
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3000/", "http://127.0.0.1:3000/"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# 全局设置实例
settings = Settings()

# 供应商配置映射
PROVIDERS = {
    "openai": {
        "name": "OpenAI",
        "base_url": "https://api.openai.com/v1",
        "api_key_field": "openai_api_key"
    },
    "siliconflow": {
        "name": "硅基流动",
        "base_url": "https://api.siliconflow.cn/v1",
        "api_key_field": "siliconflow_api_key"
    },
    "simple_api": {
        "name": "简易API中转",
        "base_url": "https://jeniya.cn/v1",
        "api_key_field": "simple_api_key"
    },
    "custom": {
        "name": "自定义API",
        "base_url": settings.custom_base_url,
        "api_key_field": "custom_api_key"
    }
}

def get_current_provider_config():
    """获取当前供应商配置"""
    provider = PROVIDERS.get(settings.current_provider)
    if not provider:
        raise ValueError(f"不支持的供应商: {settings.current_provider}")
    
    # 优先从加密存储中获取API key
    api_key = secure_storage.get_api_key(settings.current_provider)
    
    # 如果加密存储中没有，则从环境变量获取（向后兼容）
    if not api_key:
        api_key = getattr(settings, provider["api_key_field"], None)
    
    if not api_key:
        raise ValueError(f"未配置 {provider['name']} 的 API Key")
    
    # 获取base_url
    base_url = provider["base_url"]
    
    # 从加密存储中获取自定义base_url（如果有）
    provider_config = secure_storage.get_provider_config(settings.current_provider)
    if provider_config.get('base_url'):
        base_url = provider_config['base_url']
    elif settings.current_provider == "custom":
        base_url = settings.custom_base_url
    
    return {
        "base_url": base_url,
        "api_key": api_key
    }

def update_provider_secure_config(provider: str, api_key: str, base_url: str = None):
    """更新供应商的加密配置"""
    if base_url:
        return secure_storage.update_provider_config(provider, base_url, api_key)
    else:
        return secure_storage.update_api_key(provider, api_key)