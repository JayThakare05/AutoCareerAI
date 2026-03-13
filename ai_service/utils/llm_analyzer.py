import os
from dotenv import load_dotenv
from openai import OpenAI
from utils.prompts import resume_analysis_prompt
from utils.text_utils import clean_text
from utils.text_utils import normalize_text
import json
import re

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

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

def call_groq(prompt: str, temperature: float = 0) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
    )
    return response.choices[0].message.content

def analyze_resume(resume_text, job_role):
    resume_text = normalize_text(clean_text(resume_text))
    job_role = normalize_text(job_role)

    prompt = resume_analysis_prompt(resume_text, job_role)
    response = call_groq(prompt)
    result = llm_output_to_dict(response)
    return result