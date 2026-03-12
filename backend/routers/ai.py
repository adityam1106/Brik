from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import cache
from services import claude

router = APIRouter(prefix="/api/ai", tags=["ai"])

CACHE_TTL = 3600  # 1 hour — AI memos are expensive, cache aggressively


class MemoRequest(BaseModel):
    ticker: str
    company_name: str
    news_headlines: list[str] = []
    risk_signals: list[str] = []
    insider_summary: str = ""


class MemoCategory(BaseModel):
    heading: str
    points: list[str]


class MemoResponse(BaseModel):
    opportunities: MemoCategory
    risks: MemoCategory
    strategicDevelopments: MemoCategory
    financialImplications: MemoCategory


@router.post("/memo", response_model=MemoResponse)
async def generate_memo(req: MemoRequest):
    cache_key = f"memo:{req.ticker.upper()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        result = await claude.generate_memo(
            ticker=req.ticker.upper(),
            company_name=req.company_name,
            news_headlines=req.news_headlines,
            risk_signals=req.risk_signals,
            insider_summary=req.insider_summary,
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")

    cache.set(cache_key, result, CACHE_TTL)
    return result
