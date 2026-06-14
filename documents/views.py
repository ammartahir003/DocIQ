from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Document, ChatMessage
from .ai_service import summarize_pdf, answer_question

class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("USER:", request.user)
        print("AUTH:", request.auth)
        print("FILES:", request.FILES)
        print("DATA:", request.data)
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)

        doc = Document.objects.create(
            user=request.user,
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


class DocumentChatView(APIView):
    permission_classes = [IsAuthenticated]

    

    def post(self, request, doc_id):
    
        question = request.data.get('question')
        if not question:
            return Response({'error': 'No question provided'}, status=400)

        try:
            doc = Document.objects.get(id=doc_id, user=request.user)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=404)

        history = list(
            doc.messages.values('role', 'content').order_by('created_at')
        )

        answer = answer_question(doc.file.path, question, history)

        ChatMessage.objects.create(document=doc, role='user', content=question)
        ChatMessage.objects.create(document=doc, role='assistant', content=answer)

        return Response({'answer': answer}, status=200)