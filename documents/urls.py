from django.urls import path
from .views import DocumentUploadView
from .views import DocumentUploadView, DocumentChatView

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='upload'),
    path('<int:doc_id>/chat/', DocumentChatView.as_view(), name='chat'),
]