import time
from typing import Any

# Simple in-memory TTL cache — no Redis needed for MVP
# Each entry: { "value": ..., "expires_at": float }
_store: dict[str, dict] = {}


def get(key: str) -> Any | None:
    entry = _store.get(key)
    if entry is None:
        return None
    if time.time() > entry["expires_at"]:
        del _store[key]
        return None
    return entry["value"]


def set(key: str, value: Any, ttl_seconds: int = 300) -> None:
    _store[key] = {
        "value": value,
        "expires_at": time.time() + ttl_seconds,
    }


def invalidate(key: str) -> None:
    _store.pop(key, None)
