"""
API密钥加密存储工具
使用Fernet对称加密来保护API密钥
"""

import os
import json
import base64
from pathlib import Path
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from typing import Dict, Optional

class SecureStorage:
    def __init__(self, storage_file: str = "secure_config.enc"):
        self.storage_file = Path(__file__).parent / storage_file
        self.key_file = Path(__file__).parent / ".encryption_key"
        self._fernet = None
        self._initialize_encryption()
    
    def _initialize_encryption(self):
        """初始化加密密钥"""
        if self.key_file.exists():
            # 读取现有密钥
            with open(self.key_file, 'rb') as f:
                key = f.read()
        else:
            # 生成新密钥
            key = Fernet.generate_key()
            with open(self.key_file, 'wb') as f:
                f.write(key)
            # 设置文件权限只允许当前用户访问
            os.chmod(self.key_file, 0o600)
        
        self._fernet = Fernet(key)
    
    def store_config(self, config: Dict[str, any]) -> bool:
        """存储加密配置"""
        try:
            # 将配置转为JSON字符串
            config_json = json.dumps(config, ensure_ascii=False)
            
            # 加密配置
            encrypted_config = self._fernet.encrypt(config_json.encode('utf-8'))
            
            # 保存到文件
            with open(self.storage_file, 'wb') as f:
                f.write(encrypted_config)
            
            # 设置文件权限
            os.chmod(self.storage_file, 0o600)
            
            return True
        except Exception as e:
            print(f"存储配置失败: {e}")
            return False
    
    def load_config(self) -> Dict[str, any]:
        """加载解密配置"""
        try:
            if not self.storage_file.exists():
                return {}
            
            # 读取加密文件
            with open(self.storage_file, 'rb') as f:
                encrypted_config = f.read()
            
            # 解密配置
            decrypted_config = self._fernet.decrypt(encrypted_config)
            
            # 解析JSON
            config = json.loads(decrypted_config.decode('utf-8'))
            
            return config
        except Exception as e:
            print(f"加载配置失败: {e}")
            return {}
    
    def update_api_key(self, provider: str, api_key: str) -> bool:
        """更新特定供应商的API密钥"""
        config = self.load_config()
        
        if 'api_keys' not in config:
            config['api_keys'] = {}
        
        config['api_keys'][provider] = api_key
        
        return self.store_config(config)
    
    def get_api_key(self, provider: str) -> Optional[str]:
        """获取特定供应商的API密钥"""
        config = self.load_config()
        return config.get('api_keys', {}).get(provider)
    
    def update_provider_config(self, provider: str, base_url: str, api_key: str = None) -> bool:
        """更新供应商完整配置"""
        config = self.load_config()
        
        if 'providers' not in config:
            config['providers'] = {}
        
        config['providers'][provider] = {
            'base_url': base_url,
            'configured_at': json.dumps({"timestamp": "now"}),
        }
        
        if api_key:
            if 'api_keys' not in config:
                config['api_keys'] = {}
            config['api_keys'][provider] = api_key
        
        return self.store_config(config)
    
    def get_provider_config(self, provider: str) -> Dict[str, any]:
        """获取供应商配置"""
        config = self.load_config()
        provider_config = config.get('providers', {}).get(provider, {})
        api_key = config.get('api_keys', {}).get(provider)
        
        return {
            'base_url': provider_config.get('base_url'),
            'api_key': api_key,
            'configured': bool(api_key and provider_config.get('base_url'))
        }
    
    def list_providers(self) -> Dict[str, Dict[str, any]]:
        """列出所有配置的供应商"""
        config = self.load_config()
        providers = {}
        
        # 从api_keys中获取所有供应商
        for provider in config.get('api_keys', {}):
            providers[provider] = self.get_provider_config(provider)
        
        # 从providers配置中获取其他供应商
        for provider in config.get('providers', {}):
            if provider not in providers:
                providers[provider] = self.get_provider_config(provider)
        
        return providers
    
    def delete_provider(self, provider: str) -> bool:
        """删除供应商配置"""
        config = self.load_config()
        
        # 删除API密钥
        if 'api_keys' in config and provider in config['api_keys']:
            del config['api_keys'][provider]
        
        # 删除供应商配置
        if 'providers' in config and provider in config['providers']:
            del config['providers'][provider]
        
        return self.store_config(config)

# 全局实例
secure_storage = SecureStorage()