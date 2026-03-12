from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import cache
from services import perigon

router = APIRouter(prefix="/api/market", tags=["market"])

CACHE_TTL = 600  # 10 minutes

POSITIVE_WORDS = {"growth", "record", "beats", "rises", "gains", "strong", "partnership", "launch"}
NEGATIVE_WORDS = {"investigation", "decline", "loss", "scrutiny", "recall", "lawsuit", "layoffs", "fine"}


class MarketIntelItem(BaseModel):
    category: str
    insight: str
    trend: str      # positive | negative | neutral
    source: str
    date: str
    impact: str     # high | medium | low


def _score_trend(text: str) -> str:
    t = text.lower()
    pos = sum(1 for w in POSITIVE_WORDS if w in t)
    neg = sum(1 for w in NEGATIVE_WORDS if w in t)
    if pos > neg:
        return "positive"
    if neg > pos:
        return "negative"
    return "neutral"


def _score_impact(item: dict) -> str:
    # Use engagement/reach if available, else default medium
    reach = item.get("reach", 0) or 0
    if reach > 500_000:
        return "high"
    if reach > 100_000:
        return "medium"
    return "low"


@router.get("/{company}", response_model=list[MarketIntelItem])
async def get_market_intel(company: str):
    cache_key = f"market:{company.lower()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        raw = await perigon.fetch_market_intel(company)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Perigon error: {e}")

    articles = raw.get("articles") or []
    items: list[MarketIntelItem] = []

    for article in articles[:12]:
        title = article.get("title", "")
        description = article.get("description", "") or title
        source_name = (article.get("source") or {}).get("name", "Unknown")
        pub_date = (article.get("pubDate") or "")[:10]
        categories = article.get("categories") or []
        category = categories[0].get("name", "General") if categories else "General"

        items.append(MarketIntelItem(
            category=category,
            insight=description[:200],
            trend=_score_trend(title + " " + description),
            source=source_name,
            date=pub_date,
            impact=_score_impact(article),
        ))

    result = [i.model_dump() for i in items]
    cache.set(cache_key, result, CACHE_TTL)
    return result
