import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()
    
def normalize_text(text: str) -> str:
    return (
        text
        .replace("•", "-")
        .replace("◦", "-")
        .replace("–", "-")
        .replace("—", "-")
        .encode("utf-8", errors="ignore")
        .decode("utf-8", errors="ignore")
    )
