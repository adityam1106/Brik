import io
from fastapi import APIRouter, UploadFile, File, HTTPException
from services import claude

router = APIRouter(prefix="/api", tags=["upload"])


def _extract_text(content: bytes, filename: str) -> str:
    """Extract plain text from uploaded file."""
    fname = (filename or "").lower()

    if fname.endswith(".pdf"):
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            pages = [page.extract_text() or "" for page in reader.pages]
            return "\n".join(pages)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Could not read PDF: {e}")

    if fname.endswith((".txt", ".md")):
        return content.decode("utf-8", errors="replace")

    # DOCX
    if fname.endswith(".docx"):
        try:
            import zipfile, xml.etree.ElementTree as ET
            with zipfile.ZipFile(io.BytesIO(content)) as z:
                xml_content = z.read("word/document.xml")
            root = ET.fromstring(xml_content)
            ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
            texts = [t.text or "" for t in root.findall(".//w:t", ns)]
            return " ".join(texts)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Could not read DOCX: {e}")

    # Fallback: treat as plain text
    try:
        return content.decode("utf-8", errors="replace")
    except Exception:
        raise HTTPException(status_code=422, detail="Unsupported file format. Please upload PDF, TXT, or DOCX.")


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > 20 * 1024 * 1024:  # 20 MB limit
        raise HTTPException(status_code=413, detail="File too large (max 20 MB)")

    text = _extract_text(content, file.filename or "")
    if not text.strip():
        raise HTTPException(status_code=422, detail="No text could be extracted from the document.")

    try:
        result = await claude.extract_company_data(text)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {e}")

    return result
