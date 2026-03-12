import os
import httpx

BASE = "https://api.goperigon.com/v1"


def _key() -> str:
    k = os.getenv("PERIGON_KEY", "")
    if not k:
        raise ValueError("PERIGON_KEY not set")
    return k


async def fetch_market_intel(company: str) -> dict:
    url = f"{BASE}/all?q={company}&apiKey={_key()}&language=en&sortBy=relevance&size=20"
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        return r.json()
