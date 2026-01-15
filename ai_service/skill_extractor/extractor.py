import subprocess
import json
import re

def extract_skills_with_llm(text):
    prompt = f"""
You are an AI system that extracts professional skills.

Rules:
- Extract ONLY skills
- Return ONLY JSON array
- No explanation

Text:
{text}
"""

    result = subprocess.run(
        ["ollama", "run", "llama3", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,   # ⛔ ignore ANSI noise
        encoding="utf-8",
        errors="ignore"
    )

    output = result.stdout.strip()
    print("RAW OUTPUT:\n", output)

    # ✅ Extract JSON array only
    match = re.search(r"\[.*?\]", output, re.DOTALL)

    if not match:
        return []

    try:
        skills = json.loads(match.group())
        return list(set(skills))
    except json.JSONDecodeError:
        return []
