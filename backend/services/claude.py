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


EXTRACT_SYSTEM = """
You are a senior investment analyst at a top-tier institutional fund.
Given a financial document (earnings call transcript, annual report, or investor presentation), extract and generate a comprehensive company financial profile.
Use data explicitly stated in the document. For publicly-traded companies, supplement with your knowledge of their most recently reported public financials.
For forward projections, base them on guidance and trends discussed in the document.
Output ONLY valid JSON matching the exact schema provided — no markdown, no code fences, no commentary.
""".strip()

EXTRACT_SCHEMA = '''
{
  "targetCompany": {"name": "string", "ticker": "string", "sector": "string", "sharesOutstanding": 0, "netDebt": 0, "currentPrice": 0},
  "marketData": {"marketCap": 0, "enterpriseValue": 0, "fiftyTwoWeekHigh": 0, "fiftyTwoWeekLow": 0, "beta": 0, "avgDailyVolume": "string", "dividendYield": 0, "sharesOutstanding": "string"},
  "valuationMultiples": {"evEbitda": 0, "evRevenue": 0, "pe": 0, "pb": 0, "pFcf": 0, "pegRatio": 0},
  "profitabilityMargins": {"grossMargin": 0, "ebitdaMargin": 0, "netMargin": 0, "roe": 0, "roa": 0, "roic": 0},
  "growthMetrics": {"revenueGrowth1Y": 0, "revenueGrowth3Y": 0, "ebitdaGrowth1Y": 0, "ebitdaGrowth3Y": 0, "epsGrowth1Y": 0, "epsGrowth3Y": 0},
  "leverageCredit": {"totalDebtEbitda": 0, "netDebtEbitda": 0, "debtEquity": 0, "interestCoverage": 0, "altmanZScore": 0},
  "liquidityData": {"currentRatio": 0, "quickRatio": 0, "cashEquivalents": 0, "fcfYield": 0},
  "aiFindings": [{"severity": "critical|warning|positive", "category": "string", "title": "string", "detail": "string", "valuationImpact": "string"}],
  "aiRiskScore": 0,
  "footballFieldData": [{"methodology": "string", "low": 0, "mid": 0, "high": 0, "color": "#3b82f6"}],
  "dcfDefaults": {"revenue": 0, "ebitda": 0, "revenueGrowthRate": 0, "wacc": 10.0, "terminalGrowthRate": 2.5, "projectionPeriod": 5},
  "forecastData": [{"year": "string", "revenue": 0, "revenueGrowth": 0, "ebitda": 0, "ebitdaMargin": 0, "fcf": 0, "capex": 0}],
  "evBridgeData": [{"label": "string", "value": 0, "type": "start|add|subtract|total"}],
  "valuationSummary": [{"method": "string", "impliedLow": 0, "impliedMid": 0, "impliedHigh": 0, "weight": 0, "color": "#3b82f6"}],
  "comparableCompanies": [{"company": "string", "ticker": "string", "evEbitda": 0, "pe": 0, "evRevenue": 0, "marketCap": 0, "revenueGrowth": 0, "ebitdaMargin": 0}],
  "precedentTransactions": [{"date": "string", "target": "string", "acquirer": "string", "dealValue": 0, "evEbitda": 0, "premium": 0}],
  "ddAIMemo": {
    "opportunities": {"heading": "Opportunities", "points": ["string"]},
    "risks": {"heading": "Risks", "points": ["string"]},
    "strategicDevelopments": {"heading": "Strategic Developments", "points": ["string"]},
    "financialImplications": {"heading": "Financial Implications", "points": ["string"]}
  },
  "ddRiskScore": 0,
  "ddKeyDevelopments": {"7d": ["string"], "30d": ["string"], "90d": ["string"]},
  "mockRiskFlags": [{"severity": "critical|warning|informational", "category": "string", "title": "string", "detail": "string", "detectedDate": "string"}],
  "mockCorporateEvents": [{"date": "string", "type": "acquisition|partnership|management|fundraising|product|regulatory", "title": "string", "description": "string", "impact": "high|medium|low"}],
  "mockCompetitors": [{"name": "string", "ticker": "string", "marketShare": 0, "recentDevelopments": ["string"], "recentActivity": "string", "trend": "gaining|losing|stable"}],
  "mockMarketIntel": [{"category": "string", "insight": "string", "trend": "positive|negative|neutral", "source": "string", "date": "string", "impact": "high|medium|low"}]
}
'''


async def extract_company_data(document_text: str) -> dict:
    """Extract structured company financial data from a document using Claude."""
    prompt = f"""Analyze this financial document and return a complete company profile as JSON.

Document:
{document_text[:12000]}

Required JSON schema:
{EXTRACT_SCHEMA}

Rules:
- footballFieldData must have exactly 5 items using these colors in order: ["#3b82f6","#6366f1","#c9a84c","#14b8a6","#ec4899"] and methodologies ["DCF Analysis","Comparable Companies","Precedent Transactions","52-Week Trading Range","Analyst Price Targets"]
- valuationSummary must have exactly 5 items with weights summing to 100, same colors and methodologies as footballFieldData
- forecastData must have exactly 6 years: current year as "YYYY A" then 5 forward years as "YYYY E"
- evBridgeData must start with Enterprise Value, include debt/cash adjustments, end with Equity Value
- aiFindings must have 3-5 items mixing critical/warning/positive severity
- comparableCompanies must have 6-8 sector peers
- precedentTransactions must have 5-7 relevant M&A deals from the past 3 years
- ddKeyDevelopments: 4 items for 7d, 6 for 30d, 8 for 90d
- mockRiskFlags: 4-6 items
- mockCorporateEvents: 5-7 items
- mockCompetitors: 4-6 items
- mockMarketIntel: 5-7 items
- All dollar amounts in $M unless specified otherwise
- sharesOutstanding in millions for targetCompany, formatted string like "24.4B" for marketData"""

    client = _client()
    message = client.messages.create(
        model=MODEL,
        max_tokens=8096,
        system=EXTRACT_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    return json.loads(raw)
