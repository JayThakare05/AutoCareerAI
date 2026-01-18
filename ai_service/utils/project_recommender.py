from langchain_ollama import OllamaLLM
import json
import re

llm = OllamaLLM(model="llama3", temperature=0.2)

def build_project_prompt(projects: list, message: str) -> str:
    project_text = ""

    for i, p in enumerate(projects, start=1):
        title = p.get("title", "Untitled Project")
        description = p.get("description", "No description provided")
        tech_stack = ", ".join(p.get("techStack", [])) or "Not specified"

        project_text += f"""
Project {i}
Title: {title}
Description: {description}
Tech Stack: {tech_stack}
"""

    return f"""
You are a senior software engineer and career mentor.

USER'S EXISTING PROJECTS (FOR ANALYSIS ONLY):
{project_text}

CRITICAL RULES:
- Existing projects are ONLY for skill analysis
- DO NOT return, summarize, or reference them
- DO NOT reuse their titles or descriptions
- Suggest EXACTLY ONE new project
- The suggested project MUST NOT overlap with existing ones

USER MESSAGE:
{message}

TASK:
Analyze the user's skill level and recommend ONE new project that:
- Builds on their strengths
- Covers missing skills
- Maximizes resume value

RETURN FORMAT:
Return STRICTLY valid JSON with EXACTLY this structure:

{{
  "intent": "recommendation",
  "projectLevel": "beginner | intermediate | advanced",
  "recommendation": {{
    "title": "string",
    "reason": "string",
    "techStack": ["string"],
    "difficulty": "Beginner | Intermediate | Advanced",
    "resumeValue": "Low | Medium | High"
  }},
  "feedback": "string"
}}

STRICT RULES:
- Return ONLY JSON
- No markdown
- No explanation
- If more than one project is returned, the response is INVALID
"""



def parse_json_from_llm(text: str) -> dict:
    """
    Safely extract JSON from LLM output
    """
    try:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON found")

        return json.loads(match.group())
    except Exception as e:
        return {
            "intent": "error",
            "projectLevel": "unknown",
            "recommendations": [],
            "feedback": "AI response could not be parsed into JSON"
        }

def recommend_project(projects: list, message: str) -> dict:
    prompt = build_project_prompt(projects, message)
    raw_response = llm.invoke(prompt)
    print(raw_response)
    return parse_json_from_llm(raw_response)
