"""AI pipeline utilities integrating LangChain, Ollama (llama2), and ChromaDB.

Only implements functionality required by current frontend TODOs:
 - Generate embeddings for provided content (task document text)
 - Perform simple heuristic section/phrase checks
 - Produce LLM-based suggestions and a preScore
"""

from __future__ import annotations

from typing import List, Dict, Any, Optional
from datetime import datetime
import re

from chromadb import Client as ChromaClient
from chromadb.config import Settings
from django.conf import settings
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.prompts import ChatPromptTemplate

# Initialize Chroma client with persistence using Django setting.
PERSIST_DIR = getattr(settings, 'CHROMA_PERSIST_DIR', 'chroma_store')
chroma_client = ChromaClient(Settings(anonymized_telemetry=False, persist_directory=PERSIST_DIR))
_COLLECTION_NAME = "task_embeddings"

def _get_collection():
    try:
        return chroma_client.get_collection(_COLLECTION_NAME)
    except Exception:
        return chroma_client.create_collection(_COLLECTION_NAME)


_embeddings_model = OllamaEmbeddings(model="llama2")
_chat_model = ChatOllama(model="llama2", temperature=0.2)

SUGGEST_PROMPT = ChatPromptTemplate.from_template(
    """You are an assistant helping improve marketing and documentation tasks.
Given the content delimited by <content> tags, list:
1. Missing required high-level sections from: Executive summary, Budget justification, Target audience analysis, Success metrics, Legal compliance review.
2. Flag vague or generic phrases.
3. Provide 3 concise actionable improvement suggestions.
Return JSON with keys: missingSections (list), flaggedPhrases (list), suggestions (list). No extra text.
<content>
{content}
</content>
"""
)


def generate_embeddings(task_id: str, content: str) -> List[float]:
    """Create or update embeddings for a task document in Chroma.
    Returns the embedding vector used to compute preScore later (first vector)."""
    if not content.strip():
        return []
    embedding = _embeddings_model.embed_query(content)
    collection = _get_collection()
    # Upsert embedding
    collection.upsert(ids=[task_id], embeddings=[embedding], metadatas=[{"task_id": task_id}])
    return embedding


def compute_similarity_score(task_id: str, embedding: List[float]) -> float:
    """Simple self-similarity/collection diversity heuristic.
    If more documents exist, average distance to others to derive a normalization.
    Returns a float 0..1 (higher is better)."""
    if not embedding:
        return 0.0
    collection = _get_collection()
    all_ids = collection.get()["ids"] or []
    if len(all_ids) <= 1:
        return 0.75  # default baseline when only this doc exists
    # Query top similar excluding itself
    res = collection.query(query_embeddings=[embedding], n_results=min(5, len(all_ids)))
    distances_list = res.get("distances") or []
    distances = distances_list[0] if distances_list else []
    # Remove zero distance (self)
    distances = [d for d in distances if d > 1e-9]
    if not distances:
        return 0.8
    # Convert distance to similarity (assuming Euclidean-ish): similarity = 1/(1+d)
    sims = [1 / (1 + d) for d in distances]
    avg_sim = sum(sims) / len(sims)
    # Clamp 0..1
    return max(0.0, min(1.0, avg_sim))


def llm_analyze(content: str, requirements: Optional[List[str]] = None) -> Dict[str, Any]:
    """Use LLM to derive missing sections, flagged phrases and suggestions.
    If custom requirements provided, we prompt the model with those instead of the default list."""
    if not content.strip():
        return {"missingSections": [], "flaggedPhrases": [], "suggestions": []}
    prompt_chain = SUGGEST_PROMPT
    if requirements:
        # Build lightweight runtime prompt to focus on provided requirements
        dynamic_template = (
            "You are an assistant helping improve task documents. Given the content, "
            "list which of the following required sections appear to be missing (exact or close heading):\n"
            f"Required sections: {', '.join(requirements)}\n"
            "Also flag vague/generic phrases and give 3 concise improvement suggestions. "
            "Return JSON with keys: missingSections (list), flaggedPhrases (list), suggestions (list)."
            "\n<content>\n{content}\n</content>"
        )
        prompt_chain = ChatPromptTemplate.from_template(dynamic_template)
    chain = prompt_chain | _chat_model
    raw = chain.invoke({"content": content})
    text = getattr(raw, "content", str(raw))
    # Attempt to extract JSON with fallback crude parsing
    import json
    try:
        first_brace = text.find('{')
        last_brace = text.rfind('}')
        if first_brace != -1 and last_brace != -1:
            json_text = text[first_brace:last_brace+1]
            data = json.loads(json_text)
            for key in ["missingSections", "flaggedPhrases", "suggestions"]:
                data.setdefault(key, [])
            return data
    except Exception:
        pass
    # Fallback heuristic
    vague_patterns = [r"vague", r"generic", r"optimize", r"maximize", r"estimated"]
    flagged = []
    lowered = content.lower()
    for pat in vague_patterns:
        if re.search(pat, lowered):
            flagged.append(pat)
    return {
        "missingSections": [],
        "flaggedPhrases": flagged,
        "suggestions": ["Clarify vague language.", "Provide concrete metrics.", "Add missing strategic sections if any."]
    }


def run_precheck(task_id: str, content: str, requirements: Optional[List[str]] = None) -> Dict[str, Any]:
    embedding = generate_embeddings(task_id, content)
    sim_score = compute_similarity_score(task_id, embedding)
    llm_data = llm_analyze(content, requirements=requirements)

    # Heuristic pass/fail checks (tightened):
    # We now require a heading-style pattern at the start of a line (optionally markdown '#' prefix)
    # and a minimum amount of meaningful content (non-whitespace) following the heading before
    # considering the section "present". This reduces false positives caused by casual mentions.
    # Threshold tuning:
    # - Some user uploads have very brief placeholder section content (<20 chars)
    # - Keep a higher bar for loose keyword matches (to avoid false positives)
    # - Allow shorter content when a strong heading is explicitly present
    MIN_HEADING_SECTION_CHARS = 8   # strong heading present
    MIN_LOOSE_SECTION_CHARS = 20    # loose keyword fallback

    # Build heading patterns either from dynamic requirements or default canonical list
    numbering = r"(?:\d+[\).]\s*)?"
    bullet = r"(?:[-*]\s*)?"
    heading_prefix = r"^\s*(?:#{1,6}\s*)?" + numbering + bullet

    default_requirements = [
        "Executive summary",
        "Budget justification",
        "Target audience analysis",
        "Success metrics",
        "Legal compliance review",
    ]
    active_requirements = requirements if (requirements and len(requirements) > 0) else default_requirements

    def requirement_to_pattern(req: str) -> str:
        # Normalize: collapse spaces, remove trailing punctuation for pattern
        core = req.strip().lower()
        core = re.sub(r"[^a-z0-9\s]", "", core)
        words = [re.escape(w) for w in core.split() if w]
        if not words:
            return core
        joined = r"\s+".join(words)
        return heading_prefix + joined + r"\b[:\-]?"

    heading_patterns = {req: requirement_to_pattern(req) for req in active_requirements}

    passed: List[str] = []
    failed: List[str] = []

    # Evaluate each section using multiline & case-insensitive search
    debug_sections: List[Dict[str, Any]] = []

    # Helper to extract section body up until next heading candidate
    heading_barrier = re.compile(r"^\s*(?:#{1,6}\s+|[A-Z][A-Za-z0-9 ]{2,}\n)$", re.MULTILINE)

    for label, pat in heading_patterns.items():
        regex = re.compile(pat, re.IGNORECASE | re.MULTILINE)
        m = regex.search(content)
        section_pass = False
        chars_after = 0
        if m:
            tail = content[m.end():]
            # Find next heading to delimit section body (optional)
            next_heading_match = heading_barrier.search(tail)
            if next_heading_match:
                section_body = tail[:next_heading_match.start()]
            else:
                section_body = tail[:1000]  # cap for efficiency
            meaningful = re.sub(r"\s+", "", section_body)
            chars_after = len(meaningful)
            if chars_after >= MIN_HEADING_SECTION_CHARS:
                section_pass = True
        else:
            # Fallback loose keyword search (legacy) to avoid false negatives IF strong heading absent
            # Loose fallback: use first 1-2 significant words of requirement
            tokens = [t for t in re.split(r"\s+", label) if len(t) > 2]
            if not tokens:
                tokens = [label]
            loose_core = tokens[:2]
            loose_pattern = r"|".join([re.escape(t.lower()) for t in loose_core])
            loose_regex = re.compile(loose_pattern, re.IGNORECASE)
            loose_m = loose_regex.search(content)
            if loose_m:
                # Only accept if at least MIN_SECTION_CHARS following the first match (heuristic)
                loose_tail = content[loose_m.end():][:500]
                chars_after = len(re.sub(r"\s+", "", loose_tail))
                if chars_after >= MIN_LOOSE_SECTION_CHARS:
                    section_pass = True

        if section_pass:
            passed.append(label)
        else:
            failed.append(label)
        debug_sections.append({
            "label": label,
            "strongHeadingMatched": bool(m),
            "charsAfter": chars_after,
            "thresholdUsed": MIN_HEADING_SECTION_CHARS if m else MIN_LOOSE_SECTION_CHARS,
            "passed": section_pass
        })

    # Merge LLM missing sections if they overlap
    # If dynamic requirements supplied, prefer heuristic failed list; otherwise merge with LLM
    if requirements:
        missing = failed.copy()
    else:
        missing = list(set(llm_data.get("missingSections", []) + failed))

    # Combine similarity into preScore (weighting similarity 0.6 and heuristic coverage 0.4)
    coverage = len(passed) / (len(passed) + len(failed)) if (passed or failed) else 0.5
    pre_score = 0.6 * sim_score + 0.4 * coverage

    result = {
        "taskId": task_id,
        "missingSections": missing,
        "flaggedPhrases": llm_data.get("flaggedPhrases", []),
        "suggestions": llm_data.get("suggestions", [])[:3],
        "preScore": round(pre_score, 4),
        "checkedAt": datetime.utcnow().isoformat() + 'Z',
        "passedChecks": passed,
        "failedChecks": failed,
        "debug": {
            "contentLength": len(content),
            "sections": debug_sections,
            "activeRequirements": active_requirements,
            "usedDynamicRequirements": bool(requirements)
        }
    }
    return result
