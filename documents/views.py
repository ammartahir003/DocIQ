from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Document, ChatMessage
from django.http import HttpResponse
from .ai_service import export_to_excel
from .ai_service import summarize_pdf, answer_question, extract_structured_data, search_across_documents

class CrossDocumentSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'No question provided'}, status=400)

        docs = Document.objects.filter(user=request.user)
        if not docs.exists():
            return Response({'error': 'No documents to search'}, status=404)

        result = search_across_documents(docs, question)

        # Get filenames for the source ids
        source_docs = Document.objects.filter(id__in=result['source_ids'], user=request.user)
        sources = [{'id': d.id, 'filename': d.filename} for d in source_docs]

        return Response({
            'answer': result['answer'],
            'sources': sources
        }, status=200)
class ExportExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doc_ids = request.GET.get('ids', '')
        if doc_ids:
            ids = [int(i) for i in doc_ids.split(',') if i.isdigit()]
            docs = Document.objects.filter(id__in=ids, user=request.user)
        else:
            docs = Document.objects.filter(user=request.user)

        if not docs.exists():
            return Response({'error': 'No documents found'}, status=404)

        buffer = export_to_excel(docs)
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="dociq_export.xlsx"'
        return response

class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)

        doc = Document.objects.create(
            user=request.user,
            file=file,
            filename=file.name
        )

        summary = summarize_pdf(doc.file.path)
        structured = extract_structured_data(doc.file.path)

        doc.summary = summary
        doc.extracted_data = structured
        doc.save()

        return Response({
            'id': doc.id,
            'filename': doc.filename,
            'summary': summary,
            'extracted_data': structured
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
class DocumentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        docs = Document.objects.filter(user=request.user).order_by('-uploaded_at')
        data = [
            {
                'id': doc.id,
                'filename': doc.filename,
                'uploaded_at': doc.uploaded_at,
                'summary': doc.summary,
                'extracted_data': doc.extracted_data
            }
            for doc in docs
        ]
        return Response(data, status=200)


class DocumentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, doc_id):
        try:
            doc = Document.objects.get(id=doc_id, user=request.user)
            doc.file.delete()
            doc.delete()
            return Response({'message': 'Deleted'}, status=200)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)    

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doc_id):
        try:
            doc = Document.objects.get(id=doc_id, user=request.user)
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        history = list(
            doc.messages.values('role', 'content').order_by('created_at')
        )
        return Response(history, status=200)