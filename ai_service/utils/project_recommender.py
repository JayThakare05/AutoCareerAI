import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def call_groq(prompt: str, temperature: float = 0.3) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
    )
    return response.choices[0].message.content

def recommend_project(projects, message, history):

    # ------------------------
    # format projects
    # ------------------------
    project_text = ""

    for i, p in enumerate(projects, start=1):
        tech = ", ".join(p.get("techStack", []))

        project_text += f"""
Project {i}
Title: {p.get("title")}
Description: {p.get("description")}
Tech Stack: {tech}
"""

    if not project_text:
        project_text = "User has no projects."

    # ------------------------
    # format chat history
    # ------------------------
    history_text = ""

    for h in history:
        # the role mapped back from DB ('user' or 'ai')
        role = "Assistant" if h.get("role") == "ai" else "User"
        history_text += f"{role}: {h.get('text')}\n"

    # ------------------------
    # prompt
    # ------------------------
    prompt = f"""
You are an AI assistant that helps users analyze their projects, suggest new project ideas, and chat naturally about them.
You must be conversational and contextual. If the user asks a follow-up question (like "why is difficulty hard?"), answer it by looking at the conversation history and providing a helpful, natural response. Wait for user prompts.

User Projects:
{project_text}

Conversation History (Context):
{history_text}

User Message:
{message}

Do NOT output 'Sorry, your prompt is not understandable.' Just answer normally based on context.

If the user is explicitly asking for a NEW project recommendation, use this format:
🚀 Project: <Project Name>
💡 Reason: <Why it fits user's skills>
🛠️ Stack: <Technologies>
📊 Difficulty: <Easy/Medium/Hard>
⭐ Value: <Why it's good for portfolio>

If the user asks a follow-up question, or asks for advice, or anything conversational, just respond in a standard, natural chat format instead of that strict project structure.
"""

    response = call_groq(prompt)

    return response