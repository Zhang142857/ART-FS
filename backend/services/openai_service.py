from openai import OpenAI
from typing import AsyncIterator, List, Dict, Any
import json
import asyncio
import os
from config import get_current_provider_config, settings
from models import ChatMessage, ChatRequest

class OpenAIService:
    def __init__(self):
        self.client = None
        self._update_client()
    
    def _update_client(self):
        """更新OpenAI客户端配置"""
        try:
            config = get_current_provider_config()
            
            # 创建OpenAI客户端，避免代理问题
            # 临时清除socks代理环境变量
            original_all_proxy = os.environ.get('ALL_PROXY')
            original_all_proxy_lower = os.environ.get('all_proxy')
            
            # 清除可能导致问题的socks代理
            if original_all_proxy and 'socks' in original_all_proxy.lower():
                os.environ.pop('ALL_PROXY', None)
            if original_all_proxy_lower and 'socks' in original_all_proxy_lower.lower():
                os.environ.pop('all_proxy', None)
            
            try:
                self.client = OpenAI(
                    api_key=config["api_key"],
                    base_url=config["base_url"]
                )
            finally:
                # 恢复原始环境变量
                if original_all_proxy:
                    os.environ['ALL_PROXY'] = original_all_proxy
                if original_all_proxy_lower:
                    os.environ['all_proxy'] = original_all_proxy_lower
                    
        except Exception as e:
            print(f"OpenAI客户端配置错误: {e}")
            self.client = None
    
    def reload_config(self):
        """重新加载配置"""
        self._update_client()
    
    def _categorize_model(self, model_id: str) -> str:
        """根据模型ID分类模型"""
        model_id_lower = model_id.lower()
        
        if any(keyword in model_id_lower for keyword in ['gpt', 'openai']):
            return 'OpenAI'
        elif any(keyword in model_id_lower for keyword in ['claude']):
            return 'Claude'
        elif any(keyword in model_id_lower for keyword in ['qwen']):
            return 'Qwen'
        elif any(keyword in model_id_lower for keyword in ['deepseek']):
            return 'DeepSeek'
        elif any(keyword in model_id_lower for keyword in ['gemini']):
            return 'Gemini'
        elif any(keyword in model_id_lower for keyword in ['yi-']):
            return '01.AI'
        elif any(keyword in model_id_lower for keyword in ['moonshot']):
            return 'Moonshot'
        elif any(keyword in model_id_lower for keyword in ['doubao']):
            return 'Doubao'
        elif any(keyword in model_id_lower for keyword in ['ernie']):
            return 'ERNIE'
        elif any(keyword in model_id_lower for keyword in ['sparkdesk']):
            return 'SparkDesk'
        elif any(keyword in model_id_lower for keyword in ['flux', 'dall-e', 'midjourney', 'mj_', 'stable-diffusion', 'ideogram']):
            return 'Image'
        elif any(keyword in model_id_lower for keyword in ['tts', 'whisper']):
            return 'Audio'
        elif any(keyword in model_id_lower for keyword in ['embedding', 'reranker']):
            return 'Embedding'
        else:
            return 'Other'

    async def get_models(self, provider: str = None) -> List[Dict[str, Any]]:
        """获取可用模型列表
        
        Args:
            provider: 供应商名称，如果不指定则使用当前供应商
        """
        # 如果指定了供应商，临时切换客户端配置
        original_provider = settings.current_provider
        temp_client = None
        
        try:
            if provider and provider != settings.current_provider:
                # 临时切换到指定供应商
                settings.current_provider = provider
                
                # 获取指定供应商的配置
                from config import get_current_provider_config, PROVIDERS
                provider_config = get_current_provider_config()
                
                # 创建临时客户端，避免代理问题
                original_all_proxy = os.environ.get('ALL_PROXY')
                original_all_proxy_lower = os.environ.get('all_proxy')
                
                # 清除可能导致问题的socks代理
                if original_all_proxy and 'socks' in original_all_proxy.lower():
                    os.environ.pop('ALL_PROXY', None)
                if original_all_proxy_lower and 'socks' in original_all_proxy_lower.lower():
                    os.environ.pop('all_proxy', None)
                
                try:
                    temp_client = OpenAI(
                        api_key=provider_config["api_key"],
                        base_url=provider_config["base_url"]
                    )
                finally:
                    # 恢复原始环境变量
                    if original_all_proxy:
                        os.environ['ALL_PROXY'] = original_all_proxy
                    if original_all_proxy_lower:
                        os.environ['all_proxy'] = original_all_proxy_lower
                client_to_use = temp_client
            else:
                # 使用当前客户端
                if not self.client:
                    raise Exception("OpenAI客户端未配置")
                client_to_use = self.client
            
            # 尝试使用标准OpenAI API获取模型列表
            loop = asyncio.get_event_loop()
            models = await loop.run_in_executor(
                None, 
                lambda: client_to_use.models.list()
            )
            
            # 返回获取到的模型列表
            model_list = []
            for model in models.data:
                model_id = model.id
                category = self._categorize_model(model_id)
                
                model_list.append({
                    "id": model_id,
                    "name": model_id,
                    "provider": provider or settings.current_provider,
                    "category": category,
                    "description": f"{category} - {model_id}"
                })
            
            return model_list
            
        except Exception as e:
            print(f"获取模型列表错误: {e}")
            # 如果API不支持获取模型列表，返回空列表
            # 让用户在设置中手动输入模型ID
            return []
        finally:
            # 恢复原始供应商
            if provider and provider != original_provider:
                settings.current_provider = original_provider
    
    async def chat_stream(self, request: ChatRequest) -> AsyncIterator[str]:
        """流式聊天"""
        if not self.client:
            raise Exception("OpenAI客户端未配置")
        
        try:
            # 转换消息格式
            messages = [
                {"role": msg.role.value, "content": msg.content}
                for msg in request.messages
            ]
            
            # 在异步上下文中运行同步代码
            loop = asyncio.get_event_loop()
            
            def create_stream():
                return self.client.chat.completions.create(
                    model=request.model or settings.current_model,
                    messages=messages,
                    stream=True,
                    temperature=0.7,
                    max_tokens=request.max_tokens
                )
            
            response = await loop.run_in_executor(None, create_stream)
            
            # 处理流式响应
            def process_stream():
                for chunk in response:
                    if not chunk.choices:
                        continue
                    
                    choice = chunk.choices[0]
                    content = ""
                    
                    if hasattr(choice.delta, 'content') and choice.delta.content:
                        content = choice.delta.content
                    elif hasattr(choice.delta, 'reasoning_content') and choice.delta.reasoning_content:
                        content = choice.delta.reasoning_content
                    
                    if content:
                        yield content
                    
                    # 检查是否结束
                    if choice.finish_reason:
                        break
            
            # 异步生成器
            for content in await loop.run_in_executor(None, lambda: list(process_stream())):
                yield content
                
        except Exception as e:
            print(f"聊天流式响应错误: {e}")
            yield f"错误: {str(e)}"
    
    async def chat(self, request: ChatRequest) -> str:
        """非流式聊天"""
        if not self.client:
            raise Exception("OpenAI客户端未配置")
        
        try:
            # 转换消息格式
            messages = [
                {"role": msg.role.value, "content": msg.content}
                for msg in request.messages
            ]
            
            # 在异步上下文中运行同步代码
            loop = asyncio.get_event_loop()
            
            def create_completion():
                return self.client.chat.completions.create(
                    model=request.model or settings.current_model,
                    messages=messages,
                    stream=False,
                    temperature=0.7,
                    max_tokens=request.max_tokens
                )
            
            response = await loop.run_in_executor(None, create_completion)
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"聊天错误: {e}")
            return f"错误: {str(e)}"

# 全局服务实例
openai_service = OpenAIService()