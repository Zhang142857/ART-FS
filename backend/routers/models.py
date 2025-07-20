from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from models import ApiResponse
from config import settings, PROVIDERS
from services.openai_service import openai_service
from crypto_utils import secure_storage
import asyncio
import time

router = APIRouter(prefix="/api/models", tags=["models"])

@router.get("/", response_model=ApiResponse)
async def get_models(
    provider: Optional[str] = Query(None, description="供应商名称，不指定则使用当前供应商"),
    category: Optional[str] = Query(None, description="模型类别过滤"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    limit: Optional[int] = Query(100, description="返回结果限制"),
    offset: Optional[int] = Query(0, description="分页偏移")
):
    """获取模型列表
    
    支持按供应商、类别过滤，以及搜索功能
    """
    try:
        start_time = time.time()
        
        # 获取指定供应商的模型列表
        target_provider = provider or settings.current_provider
        
        # 验证供应商是否存在
        if target_provider not in PROVIDERS:
            raise HTTPException(
                status_code=400, 
                detail=f"不支持的供应商: {target_provider}"
            )
        
        # 检查供应商是否已配置
        secure_providers = secure_storage.list_providers()
        provider_info = PROVIDERS[target_provider]
        
        is_configured = (
            target_provider in secure_providers and 
            secure_providers[target_provider]['configured']
        ) or bool(getattr(settings, provider_info["api_key_field"], None))
        
        if not is_configured:
            return ApiResponse(
                success=False,
                message=f"供应商 {target_provider} 未配置API密钥",
                data={"models": [], "total_count": 0, "categories": {}}
            )
        
        # 获取模型列表
        models = await openai_service.get_models(target_provider)
        
        # 应用过滤器
        filtered_models = models
        
        if category:
            filtered_models = [
                model for model in filtered_models 
                if model.get('category', '').lower() == category.lower()
            ]
        
        if search:
            search_lower = search.lower()
            filtered_models = [
                model for model in filtered_models
                if (search_lower in model.get('id', '').lower() or
                    search_lower in model.get('name', '').lower() or
                    search_lower in model.get('category', '').lower())
            ]
        
        # 分页
        total_count = len(filtered_models)
        if offset > 0:
            filtered_models = filtered_models[offset:]
        if limit > 0:
            filtered_models = filtered_models[:limit]
        
        # 统计类别
        categories = {}
        for model in models:  # 使用原始列表统计类别
            cat = model.get('category', 'Other')
            categories[cat] = categories.get(cat, 0) + 1
        
        # 性能统计
        end_time = time.time()
        fetch_time = round((end_time - start_time) * 1000, 2)  # 毫秒
        
        return ApiResponse(
            success=True,
            message=f"成功获取 {len(filtered_models)} 个模型 (总共 {total_count} 个)",
            data={
                "models": filtered_models,
                "total_count": total_count,
                "filtered_count": len(filtered_models),
                "categories": categories,
                "provider": target_provider,
                "performance": {
                    "fetch_time_ms": fetch_time,
                    "model_count": len(models)
                },
                "pagination": {
                    "limit": limit,
                    "offset": offset,
                    "has_more": offset + len(filtered_models) < total_count
                }
            }
        )
        
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"获取模型列表失败: {str(e)}",
            data={"models": [], "total_count": 0, "categories": {}}
        )

@router.get("/categories", response_model=ApiResponse)
async def get_model_categories(provider: Optional[str] = Query(None)):
    """获取模型类别统计"""
    try:
        target_provider = provider or settings.current_provider
        models = await openai_service.get_models(target_provider)
        
        categories = {}
        for model in models:
            cat = model.get('category', 'Other')
            if cat not in categories:
                categories[cat] = {
                    "count": 0,
                    "examples": []
                }
            categories[cat]["count"] += 1
            if len(categories[cat]["examples"]) < 3:
                categories[cat]["examples"].append(model.get('id'))
        
        return ApiResponse(
            success=True,
            message=f"获取到 {len(categories)} 个类别",
            data={
                "categories": categories,
                "total_models": len(models),
                "provider": target_provider
            }
        )
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"获取类别失败: {str(e)}",
            data={"categories": {}}
        )

@router.get("/providers/{provider_name}", response_model=ApiResponse)
async def get_provider_models(provider_name: str):
    """获取特定供应商的模型列表"""
    try:
        if provider_name not in PROVIDERS:
            raise HTTPException(
                status_code=404,
                detail=f"供应商 {provider_name} 不存在"
            )
        
        models = await openai_service.get_models(provider_name)
        
        # 按类别分组
        grouped_models = {}
        for model in models:
            category = model.get('category', 'Other')
            if category not in grouped_models:
                grouped_models[category] = []
            grouped_models[category].append(model)
        
        return ApiResponse(
            success=True,
            message=f"成功获取 {provider_name} 的 {len(models)} 个模型",
            data={
                "provider": provider_name,
                "total_count": len(models),
                "grouped_models": grouped_models,
                "categories": list(grouped_models.keys())
            }
        )
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"获取供应商模型失败: {str(e)}",
            data={"models": [], "total_count": 0}
        )

@router.post("/test/{provider_name}", response_model=ApiResponse)
async def test_provider_models(provider_name: str):
    """测试特定供应商的模型列表获取"""
    try:
        if provider_name not in PROVIDERS:
            raise HTTPException(
                status_code=404,
                detail=f"供应商 {provider_name} 不存在"
            )
        
        start_time = time.time()
        
        # 尝试获取模型列表
        models = await openai_service.get_models(provider_name)
        
        end_time = time.time()
        fetch_time = round((end_time - start_time) * 1000, 2)
        
        if models:
            # 分析模型类型分布
            categories = {}
            for model in models:
                cat = model.get('category', 'Other')
                categories[cat] = categories.get(cat, 0) + 1
            
            # 获取示例模型
            sample_models = models[:5] if len(models) > 5 else models
            
            return ApiResponse(
                success=True,
                message=f"测试成功: {provider_name} 可用，找到 {len(models)} 个模型",
                data={
                    "provider": provider_name,
                    "model_count": len(models),
                    "categories": categories,
                    "sample_models": sample_models,
                    "performance": {
                        "fetch_time_ms": fetch_time,
                        "status": "healthy" if fetch_time < 3000 else "slow"
                    }
                }
            )
        else:
            return ApiResponse(
                success=False,
                message=f"{provider_name} API连接成功但无法获取模型列表",
                data={
                    "provider": provider_name,
                    "model_count": 0,
                    "error": "Empty model list"
                }
            )
            
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"测试 {provider_name} 失败: {str(e)}",
            data={
                "provider": provider_name,
                "error": str(e)
            }
        )

@router.get("/search", response_model=ApiResponse)
async def search_models(
    q: str = Query(..., description="搜索关键词"),
    provider: Optional[str] = Query(None, description="限制搜索的供应商")
):
    """全局搜索模型"""
    try:
        search_lower = q.lower()
        all_results = []
        
        # 决定搜索范围
        if provider:
            providers_to_search = [provider] if provider in PROVIDERS else []
        else:
            # 获取所有已配置的供应商
            secure_providers = secure_storage.list_providers()
            providers_to_search = []
            
            for prov_name, prov_info in PROVIDERS.items():
                is_configured = (
                    prov_name in secure_providers and 
                    secure_providers[prov_name]['configured']
                ) or bool(getattr(settings, prov_info["api_key_field"], None))
                
                if is_configured:
                    providers_to_search.append(prov_name)
        
        # 并发搜索多个供应商
        async def search_provider(prov_name):
            try:
                models = await openai_service.get_models(prov_name)
                return [
                    model for model in models
                    if (search_lower in model.get('id', '').lower() or
                        search_lower in model.get('name', '').lower() or
                        search_lower in model.get('category', '').lower())
                ]
            except:
                return []
        
        # 并发执行搜索
        tasks = [search_provider(prov) for prov in providers_to_search]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 汇总结果
        for i, result in enumerate(results):
            if isinstance(result, list):
                all_results.extend(result)
        
        # 按相关性排序（简单实现）
        def relevance_score(model):
            score = 0
            model_id = model.get('id', '').lower()
            if search_lower == model_id:
                score += 100
            elif model_id.startswith(search_lower):
                score += 50
            elif search_lower in model_id:
                score += 25
            return score
        
        all_results.sort(key=relevance_score, reverse=True)
        
        return ApiResponse(
            success=True,
            message=f"搜索 '{q}' 找到 {len(all_results)} 个模型",
            data={
                "query": q,
                "results": all_results,
                "total_count": len(all_results),
                "searched_providers": providers_to_search
            }
        )
        
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"搜索失败: {str(e)}",
            data={"results": [], "total_count": 0}
        )