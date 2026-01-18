import json
import re
from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="llama3",
    temperature=0
)

def extract_skills_with_llm(text: str) -> list[str]:
    prompt = f"""
You are an AI system that extracts professional skills.

Rules:
- Extract ONLY skills
- Return ONLY a valid JSON array
- No explanation, no markdown

Text:
{text}
"""

    response = llm.invoke(prompt).strip()

    # Extract JSON array safely
    match = re.search(r"\[.*?\]", response, re.DOTALL)
    if not match:
        return []

    try:
        skills = json.loads(match.group())
        return sorted(set(map(str.strip, skills)))
    except json.JSONDecodeError:
        return []
