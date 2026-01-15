import pytesseract
from PIL import Image
import fitz  # PyMuPDF

def extract_text(file_path):
    if file_path.lower().endswith(".pdf"):
        text = ""
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        return text

    else:  # image
        img = Image.open(file_path)
        return pytesseract.image_to_string(img)
