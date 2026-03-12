import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import news, insiders, market, ai, upload

load_dotenv()

app = FastAPI(
    title="Brik API",
    description="Backend for Brik — AI-powered due diligence platform",
    version="0.1.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(news.router)
app.include_router(insiders.router)
app.include_router(market.router)
app.include_router(ai.router)
app.include_router(upload.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "version": app.version}
