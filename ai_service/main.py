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

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ProjectChatRequest(BaseModel):
    projects: list
    message: str

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
# =====================================================
# 1️⃣ CERTIFICATE → SKILL EXTRACTION (EXISTING)
# =====================================================
@app.post("/extract-skills")
async def extract_skills(req: CertificateRequest):
    path = "../backend/" + req.file_path

    raw_text = await run_in_threadpool(extract_text, path)
    cleaned_text = clean_text(raw_text)

    skills = await run_in_threadpool(
        extract_skills_with_llm, cleaned_text
    )

    return {"skills": skills}


# =====================================================
# 2️⃣ RESUME ANALYZER (NEW)
# =====================================================
@app.post("/resume-analyze")
async def resume_analyze(
    resume: UploadFile,
    jobRole: str = Form(...)
):
    file_path = os.path.join(UPLOAD_DIR, resume.filename)
    print(file_path)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    resume_text = await run_in_threadpool(
        extract_text_from_pdf, file_path
    )
    # print(resume_text)
    result = await run_in_threadpool(
        analyze_resume, resume_text, jobRole
    )
    print(result)

    return result

@app.post("/project-recommend")
async def project_recommend(req: ProjectChatRequest):
    reply = await run_in_threadpool(
        recommend_project,
        req.projects,
        req.message
    )
    return reply