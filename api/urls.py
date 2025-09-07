from django.urls import path
from . import views

urlpatterns = [
    path('search/keywords/', views.KeywordSearchAPIView.as_view(), name='keyword-search'),
    path('ai/precheck/', views.AIPrecheckAPIView.as_view(), name='ai-precheck'),
]
