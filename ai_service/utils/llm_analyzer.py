from langchain_community.llms import Ollama
from utils.prompts import resume_analysis_prompt
from utils.text_utils import clean_text
from utils.text_utils import normalize_text

llm = Ollama(model="llama3", temperature=0)

def analyze_resume(resume_text, job_role):
    resume_text = normalize_text(clean_text(resume_text))
    job_role = normalize_text(job_role)

    prompt = resume_analysis_prompt(resume_text, job_role)
    response = llm.invoke(prompt)

    return response
