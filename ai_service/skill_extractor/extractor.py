import json
import re
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
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

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    result = response.choices[0].message.content.strip()

    # Extract JSON array safely
    match = re.search(r"\[.*?\]", result, re.DOTALL)
    if not match:
        return []

    try:
        skills = json.loads(match.group())
        return sorted(set(map(str.strip, skills)))
    except json.JSONDecodeError:
        return []
