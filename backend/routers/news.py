from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time
import cache
from services import finnhub

router = APIRouter(prefix="/api/news", tags=["news"])

CACHE_TTL = 300  # 5 minutes


class NewsArticle(BaseModel):
    id: str
    headline: str
    source: str
    url: str
    timestamp: int          # unix ms
    sentiment: str          # positive | neutral | negative
    sentimentScore: float   # 0-1
    summary: str
    category: str


def _classify_sentiment(score: float) -> str:
    if score >= 0.65:
        return "positive"
    if score <= 0.35:
        return "negative"
    return "neutral"


def _map_category(raw: dict) -> str:
    category = (raw.get("category") or "").lower()
    mapping = {
        "earnings": "Earnings",
        "merger":   "Partnership",
        "m&a":      "Partnership",
        "insider":  "Insider Activity",
        "analyst":  "Analyst Coverage",
        "product":  "Product",
    }
    for k, v in mapping.items():
        if k in category:
            return v
    return "General"


@router.get("/{ticker}", response_model=list[NewsArticle])
async def get_news(ticker: str):
    cache_key = f"news:{ticker.upper()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        raw_articles = await finnhub.fetch_company_news(ticker.upper())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Finnhub error: {e}")

    # Also fetch sentiment scores
    try:
        sentiment_data = await finnhub.fetch_sentiment(ticker.upper())
        buzz = sentiment_data.get("buzz", {})
        sentiment_score = sentiment_data.get("sentiment", {}).get("bullishPercent", 0.5)
    except Exception:
        sentiment_score = 0.5

    articles: list[NewsArticle] = []
    for i, item in enumerate(raw_articles[:20]):
        score = sentiment_score
        articles.append(NewsArticle(
            id=f"{ticker}-{i}",
            headline=item.get("headline", ""),
            source=item.get("source", ""),
            url=item.get("url", "#"),
            timestamp=item.get("datetime", int(time.time())) * 1000,
            sentiment=_classify_sentiment(score),
            sentimentScore=round(score, 2),
            summary=item.get("summary", ""),
            category=_map_category(item),
        ))

    result = [a.model_dump() for a in articles]
    cache.set(cache_key, result, CACHE_TTL)
    return result
