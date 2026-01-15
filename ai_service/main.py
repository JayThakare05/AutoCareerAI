from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool

from ocr.ocr_engine import extract_text
from utils.text_cleaner import clean_text
from skill_extractor.extractor import extract_skills_with_llm

app = FastAPI(title="AI Skill Extraction Service")

class CertificateRequest(BaseModel):
    file_path: str

@app.post("/extract-skills")
async def extract_skills(req: CertificateRequest):
    path = "../backend/" + req.file_path
    print("path:", path)

    raw_text = await run_in_threadpool(extract_text, path)
    print("raw_text received")

    cleaned_text = clean_text(raw_text)
    print("cleaned text done")

    skills = await run_in_threadpool(extract_skills_with_llm, cleaned_text)
    print("skills extracted:", skills)

    return {"skills": skills}
