import os
import httpx
from datetime import date, timedelta

BASE = "https://finnhub.io/api/v1"


def _key() -> str:
    k = os.getenv("FINNHUB_KEY", "")
    if not k:
        raise ValueError("FINNHUB_KEY not set")
    return k


async def fetch_company_news(ticker: str) -> list[dict]:
    to_date = date.today().isoformat()
    from_date = (date.today() - timedelta(days=30)).isoformat()
    url = f"{BASE}/company-news?symbol={ticker}&from={from_date}&to={to_date}&token={_key()}"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()


async def fetch_sentiment(ticker: str) -> dict:
    url = f"{BASE}/news-sentiment?symbol={ticker}&token={_key()}"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()


async def fetch_insiders(ticker: str) -> dict:
    url = f"{BASE}/stock/insider-transactions?symbol={ticker}&token={_key()}"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()
