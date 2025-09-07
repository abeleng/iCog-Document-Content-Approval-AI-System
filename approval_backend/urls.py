"""
URL configuration for approval_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import os


def root_index(_request):
    # Serve built React app if available
    index_path = settings.FRONTEND_DIST / 'index.html'
    if index_path.exists():
        try:
            return HttpResponse(index_path.read_text(encoding='utf-8'))
        except Exception:
            pass
    return JsonResponse({
        "service": "approval-backend",
        "status": "ok",
        "endpoints": ["/api/search/keywords/", "/api/ai/precheck/", "/health/"],
        "frontend": "not-built"
    })


def health(_request):
    return HttpResponse("OK", content_type="text/plain")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('health/', health, name='health'),
    # Root and SPA fallback (any non-API path)
    re_path(r'^(?!api/).*$', root_index, name='root-index'),
]
