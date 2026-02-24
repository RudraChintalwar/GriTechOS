"""
AgroDBT Python FastAPI Microservice
- PDF generation (WeasyPrint)
- Web scraping for scheme details (BeautifulSoup)
- Text translation (deep-translator)
"""

import os
import io
import re
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

import requests
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader
from deep_translator import GoogleTranslator

# WeasyPrint import — may fail if GTK is not installed; we handle gracefully
try:
    from weasyprint import HTML as WeasyprintHTML
    WEASYPRINT_AVAILABLE = True
except Exception:
    WEASYPRINT_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agrodbt-api")

app = FastAPI(title="AgroDBT Python API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jinja2 template setup
TEMPLATE_DIR = Path(__file__).parent / "templates"
jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))

# ─── Data Models ───────────────────────────────────────

class SchemeInfo(BaseModel):
    scheme_id: int
    name: str
    fullName: str
    benefit: str
    confidence: int
    category: str
    description: str
    eligibility: list[str]
    howToApply: str
    applicationLink: str
    matchReasons: list[str] = []

class ProfileInfo(BaseModel):
    district: str = ""
    farmerType: str = ""
    landOwnership: str = ""
    crops: list[str] = []
    requirements: list[str] = []

class PdfRequest(BaseModel):
    profile: ProfileInfo
    schemes: list[SchemeInfo]
    language: str = "en"

class ScrapeRequest(BaseModel):
    url: str
    scheme_name: str

class TranslateRequest(BaseModel):
    texts: list[str]
    target_language: str  # "hi" or "mr"
    source_language: str = "en"


# ─── Labels for PDF ───────────────────────────────────

PDF_LABELS = {
    "en": {
        "title": "AgroDBT — Matched Government Schemes Report",
        "profile": "Farmer Profile",
        "district": "District",
        "type": "Farmer Type",
        "crops": "Crops",
        "requirements": "Requirements",
        "schemes": "Matched Schemes",
        "benefit": "Benefit",
        "confidence": "Match",
        "description": "Description",
        "eligibility": "Required Documents",
        "howToApply": "How to Apply",
        "generatedAt": "Generated on",
        "note": "This is an auto-generated report. Please verify details with official sources before applying.",
    },
    "hi": {
        "title": "AgroDBT — मिलती-जुलती सरकारी योजनाएँ रिपोर्ट",
        "profile": "किसान प्रोफ़ाइल",
        "district": "जिला",
        "type": "किसान प्रकार",
        "crops": "फसलें",
        "requirements": "आवश्यकताएँ",
        "schemes": "मिलती-जुलती योजनाएँ",
        "benefit": "लाभ",
        "confidence": "मिलान",
        "description": "विवरण",
        "eligibility": "आवश्यक दस्तावेज",
        "howToApply": "आवेदन कैसे करें",
        "generatedAt": "तारीख",
        "note": "यह एक स्वचालित रिपोर्ट है। कृपया आवेदन करने से पहले आधिकारिक जानकारी सत्यापित करें।",
    },
    "mr": {
        "title": "AgroDBT — जुळणाऱ्या सरकारी योजना अहवाल",
        "profile": "शेतकरी प्रोफाइल",
        "district": "जिल्हा",
        "type": "शेतकरी प्रकार",
        "crops": "पिके",
        "requirements": "आवश्यकता",
        "schemes": "जुळणाऱ्या योजना",
        "benefit": "लाभ",
        "confidence": "जुळणी",
        "description": "वर्णन",
        "eligibility": "आवश्यक कागदपत्रे",
        "howToApply": "अर्ज कसा करावा",
        "generatedAt": "तारीख",
        "note": "हा एक स्वयंचलित अहवाल आहे. कृपया अर्ज करण्यापूर्वी अधिकृत माहिती तपासा.",
    },
}


# ─── 1. PDF Generation ────────────────────────────────

@app.post("/api/generate-pdf")
async def generate_pdf(req: PdfRequest):
    """Generate a themed PDF report of matched schemes."""
    labels = PDF_LABELS.get(req.language, PDF_LABELS["en"])

    template = jinja_env.get_template("pdf_template.html")
    html_content = template.render(
        labels=labels,
        profile=req.profile.model_dump(),
        schemes=[s.model_dump() for s in req.schemes],
        date=datetime.now().strftime("%d/%m/%Y"),
        lang=req.language,
    )

    if WEASYPRINT_AVAILABLE:
        # Server-side PDF via WeasyPrint
        pdf_bytes = WeasyprintHTML(string=html_content).write_pdf()
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="AgroDBT_Schemes_{req.language}.pdf"'
            },
        )
    else:
        # Fallback: return styled HTML (frontend can print-to-PDF)
        return StreamingResponse(
            io.BytesIO(html_content.encode("utf-8")),
            media_type="text/html; charset=utf-8",
        )


# ─── 2. Web Scraping for Scheme Details ───────────────

SCRAPE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
}

# Cache scraped results in memory to avoid re-scraping
_scrape_cache: dict[str, dict] = {}


def _clean_text(text: str) -> str:
    """Clean scraped text: collapse whitespace, strip."""
    return re.sub(r'\s+', ' ', text).strip()


def _scrape_generic(url: str, scheme_name: str) -> dict:
    """Generic scraper that extracts structured content from a webpage."""
    try:
        resp = requests.get(url, headers=SCRAPE_HEADERS, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        logger.warning(f"Failed to fetch {url}: {e}")
        return {"error": "Could not access the website", "source": url}

    soup = BeautifulSoup(resp.text, "html.parser")

    # Remove script, style, nav, footer elements
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    # Extract page title
    title = soup.title.string if soup.title else scheme_name
    title = _clean_text(title)

    # Extract all meaningful text blocks
    content_sections = []

    # Look for headings + following content
    for heading in soup.find_all(["h1", "h2", "h3", "h4"]):
        heading_text = _clean_text(heading.get_text())
        if not heading_text or len(heading_text) < 3:
            continue

        # Collect sibling content after heading
        content_parts = []
        for sibling in heading.find_next_siblings():
            if sibling.name in ["h1", "h2", "h3", "h4"]:
                break
            text = _clean_text(sibling.get_text())
            if text and len(text) > 10:
                content_parts.append(text)

        if content_parts:
            content_sections.append({
                "heading": heading_text,
                "content": "\n".join(content_parts[:5]),  # Limit to 5 paragraphs
            })

    # Extract tables
    tables = []
    for table in soup.find_all("table")[:3]:  # Max 3 tables
        rows = []
        for tr in table.find_all("tr"):
            cells = [_clean_text(td.get_text()) for td in tr.find_all(["td", "th"])]
            if any(cells):
                rows.append(cells)
        if rows:
            tables.append(rows)

    # Extract list items (useful for eligibility, documents, etc.)
    lists = []
    for ul in soup.find_all(["ul", "ol"])[:5]:
        items = [_clean_text(li.get_text()) for li in ul.find_all("li") if _clean_text(li.get_text())]
        if items:
            lists.append(items)

    # Find links related to application
    apply_links = []
    for a in soup.find_all("a", href=True):
        link_text = _clean_text(a.get_text()).lower()
        if any(kw in link_text for kw in ["apply", "register", "login", "अर्ज", "नोंदणी", "आवेदन"]):
            apply_links.append({"text": _clean_text(a.get_text()), "url": a["href"]})

    return {
        "title": title,
        "scheme_name": scheme_name,
        "source_url": url,
        "sections": content_sections[:10],  # Limit sections
        "tables": tables,
        "lists": lists[:5],
        "apply_links": apply_links[:5],
        "scraped_at": datetime.now().isoformat(),
    }


@app.post("/api/scrape-scheme")
async def scrape_scheme(req: ScrapeRequest):
    """Scrape a scheme website for detailed information."""
    cache_key = f"{req.url}:{req.scheme_name}"

    if cache_key in _scrape_cache:
        logger.info(f"Returning cached result for {req.scheme_name}")
        return _scrape_cache[cache_key]

    result = _scrape_generic(req.url, req.scheme_name)
    _scrape_cache[cache_key] = result
    return result


# ─── 3. Translation ──────────────────────────────────

LANG_MAP = {"hi": "hi", "mr": "mr", "en": "en"}

@app.post("/api/translate")
async def translate_text(req: TranslateRequest):
    """Translate a list of texts using Google Translate."""
    target = LANG_MAP.get(req.target_language, "hi")
    source = LANG_MAP.get(req.source_language, "en")

    if source == target:
        return {"translations": req.texts}

    try:
        translator = GoogleTranslator(source=source, target=target)
        results = []
        for text in req.texts:
            if not text or not text.strip():
                results.append(text)
                continue
            translated = translator.translate(text)
            results.append(translated or text)
        return {"translations": results}
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


# ─── Health Check ─────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "weasyprint_available": WEASYPRINT_AVAILABLE,
        "timestamp": datetime.now().isoformat(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
