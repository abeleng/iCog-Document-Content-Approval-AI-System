export async function keywordSearch(query, tasks) {
  if (!query.trim()) return [];
  const payload = {
    query,
    items: (tasks || []).map(t => ({ id: t.id, title: t.title, description: t.description }))
  };
  const res = await fetch('http://localhost:8000/api/search/keywords/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Keyword search failed');
  return await res.json();
}

export async function aiPrecheck(taskId, content, requirements) {
  const payload = { task_id: taskId, content };
  if (Array.isArray(requirements) && requirements.length) {
    payload.requirements = requirements;
  }
  const res = await fetch('http://localhost:8000/api/ai/precheck/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('AI precheck failed');
  return await res.json();
}
