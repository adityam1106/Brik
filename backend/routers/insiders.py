from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import cache
from services import finnhub

router = APIRouter(prefix="/api/insiders", tags=["insiders"])

CACHE_TTL = 600  # 10 minutes
UNUSUAL_THRESHOLD = 1_000_000  # flag transactions over $1M as unusual


class InsiderTransaction(BaseModel):
    name: str
    title: str
    transactionType: str   # buy | sell
    shares: int
    value: float
    date: str
    isUnusual: bool


@router.get("/{ticker}", response_model=list[InsiderTransaction])
async def get_insiders(ticker: str):
    cache_key = f"insiders:{ticker.upper()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        raw = await finnhub.fetch_insiders(ticker.upper())
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Finnhub error: {e}")

    transactions: list[InsiderTransaction] = []
    for item in (raw.get("data") or [])[:30]:
        change = item.get("change", 0)
        shares = abs(change)
        value = abs(item.get("transactionPrice", 0) * shares)
        tx_type = "buy" if change > 0 else "sell"

        transactions.append(InsiderTransaction(
            name=item.get("name", "Unknown"),
            title=item.get("officerTitle", ""),
            transactionType=tx_type,
            shares=shares,
            value=value,
            date=item.get("transactionDate", ""),
            isUnusual=value > UNUSUAL_THRESHOLD and tx_type == "sell",
        ))

    result = [t.model_dump() for t in transactions]
    cache.set(cache_key, result, CACHE_TTL)
    return result
