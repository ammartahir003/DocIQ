import groq
import fitz
from django.conf import settings

client = groq.Groq(api_key=settings.GROQ_API_KEY)

def extract_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def summarize_pdf(file_path: str) -> str:
    text = extract_text(file_path)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a document analysis assistant. Summarize documents clearly and concisely."
            },
            {
                "role": "user",
                "content": f"Summarize this document in 3 bullet points:\n\n{text[:8000]}"
            }
        ],
        max_tokens=1024
    )
    return response.choices[0].message.content

def answer_question(file_path: str, question: str, history: list) -> str:
    text = extract_text(file_path)

    messages = [
        {
            "role": "system",
            "content": f"You are a document assistant. Answer questions using only this document:\n\n{text[:8000]}"
        }
    ]

    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=1024
    )
    return response.choices[0].message.content