import os
import json
import anthropic

MODEL = "claude-sonnet-4-6"


def _client() -> anthropic.Anthropic:
    key = os.getenv("ANTHROPIC_KEY", "")
    if not key:
        raise ValueError("ANTHROPIC_KEY not set")
    return anthropic.Anthropic(api_key=key)


MEMO_SYSTEM = """
You are a senior investment analyst at a top-tier institutional fund.
Given company data, produce a structured due diligence memo as JSON.
Be concise, specific, and data-driven. Use financial terminology.
Output ONLY valid JSON — no markdown, no code fences, no commentary.
""".strip()

MEMO_SCHEMA = """
{
  "opportunities": {
    "heading": "Opportunities",
    "points": ["<string>", ...]   // 3-4 bullet points
  },
  "risks": {
    "heading": "Risks",
    "points": ["<string>", ...]   // 3-4 bullet points
  },
  "strategicDevelopments": {
    "heading": "Strategic Developments",
    "points": ["<string>", ...]   // 3-4 bullet points
  },
  "financialImplications": {
    "heading": "Financial Implications",
    "points": ["<string>", ...]   // 3-4 bullet points
  }
}
""".strip()


async def generate_memo(
    ticker: str,
    company_name: str,
    news_headlines: list[str],
    risk_signals: list[str],
    insider_summary: str,
) -> dict:
    headlines_text = "\n".join(f"- {h}" for h in news_headlines[:8])
    risks_text = "\n".join(f"- {r}" for r in risk_signals[:6])

    prompt = f"""
Company: {company_name} ({ticker})

Recent News Headlines:
{headlines_text}

Risk Signals:
{risks_text}

Insider Activity Summary:
{insider_summary}

Produce a due diligence memo matching this exact JSON schema:
{MEMO_SCHEMA}
""".strip()

    client = _client()
    message = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=MEMO_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    return json.loads(raw)
