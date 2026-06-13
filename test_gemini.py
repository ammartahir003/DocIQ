import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from documents.ai_service import summarize_pdf

result = summarize_pdf(r'')
print(result)