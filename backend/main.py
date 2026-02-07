import os
import re
from typing import List, Optional

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from detector import HateSpeechDetector

app = FastAPI(
    title="Hate Speech Detection API",
    description="Generative AI model to detect hate speech in messages",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = HateSpeechDetector()

OLLAMA_BASE = os.environ.get("OLLAMA_BASE", "http://127.0.0.1:11434")
AVATAR_CHAT_MODEL = os.environ.get("OLLAMA_AVATAR_MODEL", "deepseek-r1:1.5b")

AVATAR_SYSTEM_PROMPT = """You are a kind, supportive friend in the Safe-Talk app. Chat simply about hate speech and criticism awareness.

Output ONLY your direct reply. No think tags, no reasoning, no <think> or think>. Just 2-3 short, warm sentences. Reply with empathy. Example: "I'm doing well, thanks! How are you? I'm here if you need to talk." """


def _strip_think_tags(text: str) -> str:
    """Remove think/<think> blocks (deepseek-r1 outputs reasoning)."""
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"think>.*?(?=\n\n|<think>|$)", "", text, flags=re.DOTALL | re.IGNORECASE)
    lines = [ln.strip() for ln in text.split("\n") if ln.strip() and not ln.strip().lower().startswith("think>")]
    return " ".join(lines).strip()


def _truncate_reply(text: str, max_chars: int = 280) -> str:
    """Keep only first sentences to avoid model hallucination overflow."""
    if len(text) <= max_chars:
        return text.strip()
    chunk = text[:max_chars]
    last_period = chunk.rfind(".")
    if last_period > max_chars // 2:
        return chunk[: last_period + 1].strip()
    return chunk.strip()


class TextRequest(BaseModel):
    text: str


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class AvatarChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None  # default phi


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/detect-hate")
async def detect_hate(request: TextRequest):
    """Detect hate speech in the given message text using generative AI."""
    result = detector.detect(request.text)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@app.post("/chat-avatar")
async def chat_avatar(request: AvatarChatRequest):
    """Proxy to local Ollama for avatar chat. Uses deepseek-r1:1.5b by default."""
    model = request.model or AVATAR_CHAT_MODEL
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    if not any(m.get("role") == "system" for m in messages):
        messages.insert(0, {"role": "system", "content": AVATAR_SYSTEM_PROMPT})
    payload = {"model": model, "messages": messages, "stream": False}
    try:
        r = requests.post(
            f"{OLLAMA_BASE}/api/chat",
            json=payload,
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        raw = data.get("message", {}).get("content", "").strip()
        raw = _strip_think_tags(raw)
        reply = _truncate_reply(raw)
        return {"content": reply}
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama unavailable or error: {str(e)}. Is Ollama running and is the model pulled? Try: ollama run {model}",
        )
