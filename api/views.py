from django.shortcuts import render
# from rest_framework imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .ai_pipeline import run_precheck

class KeywordSearchAPIView(APIView):
	"""
	POST /api/search/keywords/
	Request: { "query": "string" }
	Response: List of tasks/documents matching the keyword in title/description.
	"""
	def post(self, request):
		"""Perform simple keyword search over provided items list.
		Payload example: {"query": "newsletter", "items": [{"id": "...", "title": "..", "description": ".."}]}.
		This avoids adding storage beyond TODO requirements.
		"""
		query = (request.data.get('query') or '').strip().lower()
		items = request.data.get('items') or []
		if not query or not items:
			return Response([], status=status.HTTP_200_OK)
		results = []
		for item in items:
			title = (item.get('title') or '').lower()
			desc = (item.get('description') or '').lower()
			if query in title or query in desc:
				results.append({
					'taskId': item.get('id'),
					'title': item.get('title'),
					'description': item.get('description'),
					'matchType': 'title_description'
				})
		return Response(results, status=status.HTTP_200_OK)

class AIPrecheckAPIView(APIView):
	"""
	POST /api/ai/precheck/
	Request: { "task_id": "string", "content": "string" }
	Response: AI pre-check results (embeddings, suggestions, score, etc.)
	"""
	def post(self, request):
		task_id = request.data.get('task_id')
		content = request.data.get('content')
		requirements = request.data.get('requirements')  # optional list
		if not task_id or not content:
			return Response({"detail": "task_id and content are required"}, status=status.HTTP_400_BAD_REQUEST)
		if requirements is not None and not isinstance(requirements, list):
			return Response({"detail": "requirements must be a list of strings"}, status=status.HTTP_400_BAD_REQUEST)
		try:
			result = run_precheck(task_id, content, requirements=requirements)
			return Response(result, status=status.HTTP_200_OK)
		except Exception as e:
			return Response({"detail": f"AI processing error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Create your views here.
