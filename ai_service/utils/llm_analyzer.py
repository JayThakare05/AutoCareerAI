from langchain_ollama import OllamaLLM
from utils.prompts import resume_analysis_prompt
from utils.text_utils import clean_text
from utils.text_utils import normalize_text
import json
import re

def llm_output_to_dict(response: str) -> dict:
    """
    Converts LLM string output (JSON text) into Python dict
    """
    try:
        # Extract JSON part if extra text exists
        json_match = re.search(r"\{[\s\S]*\}", response)
        if not json_match:
            raise ValueError("No JSON found in LLM output")

        json_text = json_match.group()
        return json.loads(json_text)

    except Exception as e:
        print("JSON parsing failed:", e)
        return {}

llm = OllamaLLM(model="llama3", temperature=0)

def analyze_resume(resume_text, job_role):
    resume_text = normalize_text(clean_text(resume_text))
    job_role = normalize_text(job_role)

    prompt = resume_analysis_prompt(resume_text, job_role)
    response = llm.invoke(prompt)
    result = llm_output_to_dict(response)
    return result