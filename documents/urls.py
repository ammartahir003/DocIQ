from django.urls import path
from .views import DocumentUploadView, DocumentChatView, DocumentListView, DocumentDeleteView, ChatHistoryView, ExportExcelView, CrossDocumentSearchView

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='upload'),
    path('<int:doc_id>/chat/', DocumentChatView.as_view(), name='chat'),
    path('<int:doc_id>/messages/', ChatHistoryView.as_view(), name='chat-history'),
    path('export/', ExportExcelView.as_view(), name='export'),
    path('search/', CrossDocumentSearchView.as_view(), name='search'),
    path('', DocumentListView.as_view(), name='list'),
    path('<int:doc_id>/delete/', DocumentDeleteView.as_view(), name='delete'),
]