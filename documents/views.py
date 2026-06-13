from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from .serializers import DocumentSerializer
from .ai_service import summarize_pdf
from .models import Document, ChatMessage
from .ai_service import summarize_pdf, answer_question

class DocumentChatView(APIView):
    def post(self, request, doc_id):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'No question provided'}, status=400)

        try:
            doc = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=404)

        history = list(
            doc.messages.values('role', 'content').order_by('created_at')
        )

        answer = answer_question(doc.file.path, question, history)

        ChatMessage.objects.create(document=doc, role='user', content=question)
        ChatMessage.objects.create(document=doc, role='assistant', content=answer)

        return Response({'answer': answer}, status=200)
class DocumentUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)

        doc = Document.objects.create(
            file=file,
            filename=file.name
        )

        summary = summarize_pdf(doc.file.path)
        doc.summary = summary
        doc.save()

        return Response({
            'id': doc.id,
            'filename': doc.filename,
            'summary': summary
        }, status=201)