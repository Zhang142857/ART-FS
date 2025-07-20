#!/usr/bin/env python3
"""
详细的模型列表测试 - 显示更多模型信息
"""

import requests
import json

def test_simple_api_detailed():
    """详细测试简易API中转的模型列表"""
    
    url = "https://jeniya.cn/v1/models"
    headers = {
        "Authorization": "Bearer sk-LHVKQ2Y0RvdXg7DXuouyUcXs2q1uJGfSLsBxcteHV1B7THNO",
        "Content-Type": "application/json"
    }
    
    print("🔍 详细测试简易API中转模型列表...")
    print(f"📡 请求URL: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"📄 HTTP状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"📦 响应数据类型: {type(data)}")
            
            if isinstance(data, dict):
                print(f"🔑 响应字段: {list(data.keys())}")
                
                models = data.get("data", [])
                if not models and "models" in data:
                    models = data["models"]
                
            elif isinstance(data, list):
                models = data
            else:
                models = []
            
            print(f"📊 模型总数: {len(models)}")
            
            # 分析模型类型
            model_types = {}
            model_ids = []
            
            for i, model in enumerate(models[:20]):  # 只看前20个
                if isinstance(model, dict):
                    model_id = model.get("id") or model.get("model") or model.get("name")
                    if model_id:
                        model_ids.append(model_id)
                        
                        # 分析模型类型
                        if any(keyword in model_id.lower() for keyword in ['gpt', 'openai']):
                            model_types['OpenAI'] = model_types.get('OpenAI', 0) + 1
                        elif any(keyword in model_id.lower() for keyword in ['claude']):
                            model_types['Claude'] = model_types.get('Claude', 0) + 1
                        elif any(keyword in model_id.lower() for keyword in ['qwen']):
                            model_types['Qwen'] = model_types.get('Qwen', 0) + 1
                        elif any(keyword in model_id.lower() for keyword in ['deepseek']):
                            model_types['DeepSeek'] = model_types.get('DeepSeek', 0) + 1
                        elif any(keyword in model_id.lower() for keyword in ['gemini']):
                            model_types['Gemini'] = model_types.get('Gemini', 0) + 1
                        else:
                            model_types['Other'] = model_types.get('Other', 0) + 1
                        
                        if i < 10:
                            print(f"   {i+1:2d}. {model_id}")
                            if len(model.keys()) > 1:
                                print(f"       字段: {list(model.keys())}")
                elif isinstance(model, str):
                    model_ids.append(model)
                    if i < 10:
                        print(f"   {i+1:2d}. {model}")
            
            print(f"\n📊 模型类型分布:")
            for model_type, count in sorted(model_types.items(), key=lambda x: x[1], reverse=True):
                print(f"   {model_type}: {count} 个")
            
            print(f"\n🎯 热门模型示例:")
            popular_keywords = ['gpt-4o', 'claude', 'deepseek', 'qwen', 'gemini']
            for keyword in popular_keywords:
                matching_models = [m for m in model_ids if keyword in m.lower()]
                if matching_models:
                    print(f"   {keyword.upper()}: {matching_models[:3]}")
            
            # 验证是否在预期范围内
            if 500 <= len(models) <= 600:
                print(f"\n✅ 模型数量验证: {len(models)} 个模型，在预期范围内 (500-600)")
            else:
                print(f"\n⚠️  模型数量验证: {len(models)} 个模型，超出预期范围 (500-600)")
                
        else:
            print(f"❌ 请求失败: {response.status_code}")
            print(f"📄 错误响应: {response.text}")
            
    except Exception as e:
        print(f"❌ 异常错误: {str(e)}")

def test_backend_detailed():
    """详细测试后端API模型获取"""
    
    print("\n🔍 详细测试后端API模型获取...")
    
    try:
        # 登录
        login_response = requests.post(
            "http://localhost:8001/api/auth/login",
            json={"username": "admin", "password": "admin123"}
        )
        
        if login_response.status_code != 200:
            print(f"❌ 登录失败: {login_response.status_code}")
            return
            
        token = login_response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # 设置简易API
        settings_response = requests.put(
            "http://localhost:8001/api/settings/",
            json={
                "current_provider": "simple_api",
                "api_key": "sk-LHVKQ2Y0RvdXg7DXuouyUcXs2q1uJGfSLsBxcteHV1B7THNO",
                "base_url": "https://jeniya.cn/v1"
            },
            headers=headers
        )
        
        if settings_response.status_code != 200:
            print(f"❌ 设置失败: {settings_response.status_code}")
            return
        
        # 测试连接
        test_response = requests.post(
            "http://localhost:8001/api/settings/test",
            headers=headers
        )
        
        if test_response.status_code == 200:
            data = test_response.json()
            print(f"✅ 后端API响应成功")
            print(f"📄 响应消息: {data.get('message', '')}")
            
            models = data.get("data", {}).get("models", [])
            print(f"📊 通过后端获取的模型数: {len(models)}")
            
            if models:
                print(f"🎯 后端返回的前10个模型:")
                for i, model in enumerate(models[:10]):
                    if isinstance(model, dict):
                        model_id = model.get('id', 'Unknown')
                        print(f"   {i+1:2d}. {model_id}")
                    else:
                        print(f"   {i+1:2d}. {model}")
        else:
            print(f"❌ 后端测试失败: {test_response.status_code}")
            
    except Exception as e:
        print(f"❌ 后端测试异常: {str(e)}")

if __name__ == "__main__":
    test_simple_api_detailed()
    test_backend_detailed()