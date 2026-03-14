from fastapi import FastAPI, UploadFile, Form
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
import os
import shutil

# ---------- EXISTING IMPORTS ----------
from ocr.ocr_engine import extract_text
from utils.text_cleaner import clean_text
from skill_extractor.extractor import extract_skills_with_llm

# ---------- NEW IMPORTS ----------
from utils.resume_parser import extract_text_from_pdf
from utils.llm_analyzer import analyze_resume
from utils.project_recommender import recommend_project

app = FastAPI(title="AutoCareerAI – Unified AI Service")

# ---------- MODELS ----------
class CertificateRequest(BaseModel):
    file_path: str
# ---------- CONFIG ----------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper to download from URL to a temporary local file
def download_url_to_temp(url: str):
    import urllib.request
    import tempfile
    
    response = urllib.request.urlopen(url)
    content_type = response.info().get_content_type()
    
    # Determine extension
    extension = "pdf" if "pdf" in content_type else "jpg"
    if "." in url:
        url_ext = url.split(".")[-1].split("?")[0]
        if len(url_ext) <= 4:
            extension = url_ext
            
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}")
    try:
        tmp.write(response.read())
        return tmp.name
    finally:
        tmp.close()

class ProjectChatRequest(BaseModel):
    projects: list
    message: str
    history: list = []
# =====================================================
# 1️⃣ CERTIFICATE → SKILL EXTRACTION (EXISTING)
# =====================================================
@app.post("/extract-skills")
async def extract_skills(req: CertificateRequest):
    file_path = req.file_path
    local_path = None
    
    try:
        if file_path.startswith("http"):
            local_path = await run_in_threadpool(download_url_to_temp, file_path)
            raw_text = await run_in_threadpool(extract_text, local_path)
        else:
            # Local fallback (should be avoided as per user request)
            local_path = "../backend/" + file_path
            raw_text = await run_in_threadpool(extract_text, local_path)
            local_path = None # Don't delete if it was a local fallback path
            
        cleaned_text = clean_text(raw_text)
        skills = await run_in_threadpool(extract_skills_with_llm, cleaned_text)
        return {"skills": skills}
        
    except Exception as e:
        print(f"Extraction error: {e}")
        return {"skills": [], "error": str(e)}
    finally:
        if local_path and os.path.exists(str(local_path)) and "temp" in str(local_path):
            os.remove(str(local_path))


# =====================================================
# 2️⃣ RESUME ANALYZER (NEW)
# =====================================================
@app.post("/resume-analyze")
async def resume_analyze(
    resume: UploadFile = None,
    file_url: str = Form(None),
    jobRole: str = Form(...)
):
    local_path = None
    try:
        if file_url:
            # User wants direct Cloudinary fetching
            local_path = await run_in_threadpool(download_url_to_temp, file_url)
        elif resume:
            # Fallback for direct upload
            local_path = os.path.join(UPLOAD_DIR, f"temp_{resume.filename}")
            with open(local_path, "wb") as buffer:
                shutil.copyfileobj(resume.file, buffer)
        else:
            return {"error": "No resume provided"}

        resume_text = await run_in_threadpool(extract_text_from_pdf, local_path)
        result = await run_in_threadpool(analyze_resume, resume_text, jobRole)
        return result
        
    except Exception as e:
        print(f"Resume analysis error: {e}")
        return {"error": str(e)}
    finally:
        if local_path and os.path.exists(str(local_path)):
            os.remove(str(local_path))

@app.post("/project-recommend")
async def project_recommend(req: ProjectChatRequest):
    reply = await run_in_threadpool(
        recommend_project,
        req.projects,
        req.message,
        req.history
    )
    # print(reply)
    return reply