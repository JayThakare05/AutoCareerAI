def resume_analysis_prompt(resume_text, job_role):
    return f"""
You are an expert ATS resume evaluator and career coach.

TASK:
Analyze the resume ONLY using the given content.
Do NOT invent information.
Do NOT add explanations.

TARGET JOB ROLE:
{job_role}

RETURN FORMAT:
Return STRICTLY a valid JSON object with EXACTLY these keys:

{{
  "summary": "3–4 line professional summary",
  "skills": ["list of detected skills"],
  "missingSkills": ["skills missing for the job role"],
  "suggestions": ["clear ATS-friendly improvements"]
}}

RULES:
- Output ONLY JSON
- No markdown
- No bullet symbols
- No extra text before or after JSON
- Values must be strings or arrays of strings

RESUME CONTENT:
{resume_text}
"""
