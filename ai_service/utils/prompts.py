# def resume_analysis_prompt(resume_text, job_role):
#     return f"""
# You are an expert ATS resume evaluator and career coach.

# TASK:
# Analyze the resume ONLY using the given content.
# Do NOT invent information.
# Do NOT add explanations.

# TARGET JOB ROLE:
# {job_role}

# RETURN FORMAT:
# Return STRICTLY a valid JSON object with EXACTLY these keys:

# {{
#   "summary": "3–4 line professional summary",
#   "skills": ["list of detected skills"],
#   "missingSkills": ["skills missing for the job role"],
#   "suggestions": ["clear ATS-friendly improvements"]
# }}

# RULES:


# - You MUST return ONLY valid JSON.
# - No markdown
# - No bullet symbols
# - No extra text before or after JSON
# - Values must be strings or arrays of strings
# -If unsure, return empty arrays.


# RESUME CONTENT:
# {resume_text}
# """
def resume_analysis_prompt(resume_text, job_role):
    return f"""
You are an expert ATS resume evaluator and career coach.

TASK:
Analyze the resume ONLY using the given content.
Do NOT invent information.
Do NOT add explanations.

TARGET JOB ROLE:
{job_role}

SCORING LOGIC (IMPORTANT):
Calculate an ATS score between 0 and 100 based on:
- Skill match with the job role
- Resume relevance
- ATS keyword optimization
- Clarity and structure

RETURN FORMAT:
Return STRICTLY a valid JSON object with EXACTLY these keys:

{{
  "summary": "3–4 line professional summary",
  "skills": ["list of detected skills"],
  "missingSkills": ["skills missing for the job role"],
  "suggestions": ["clear ATS-friendly improvements"],
  "atsScore": number
}}

RULES:
- atsScore MUST be an integer between 0 and 100
- You MUST return ONLY valid JSON
- No markdown
- No bullet symbols
- No extra text before or after JSON
- Values must be strings or arrays of strings
- If unsure, return empty arrays and atsScore as 0

RESUME CONTENT:
{resume_text}
"""
