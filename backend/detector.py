import os
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_OPENROUTER_MODEL = "mistralai/mistral-7b-instruct"  # Free tier model

class HateSpeechDetector:
    def __init__(self):
        self.openrouter_model = DEFAULT_OPENROUTER_MODEL
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY is not set. Add it in .env or environment.")

    def detect(self, text: str):
        prompt = self._build_prompt(text)
        try:
            response_text = self.generate_with_llm(prompt)
        except Exception as e:
            return {"error": str(e)}

        parsed = self._parse_llm_response(response_text)

        label = parsed.get("label", "neutral")
        score = float(parsed.get("toxicity_score", 0.0))
        is_hate = str(parsed.get("is_hate", "false")).lower() == "true"
        explanation = parsed.get("explanation", "")

        toxic_words = self.extract_toxic_words(text)
        if not is_hate and toxic_words:
            is_hate = True
            label = "lexical_hate"
            score = max(score, 0.5)
            if not explanation:
                explanation = f"Contains potentially harmful words: {', '.join(toxic_words)}"

        return {
            "is_hate": is_hate,
            "toxicity_score": round(score, 2),
            "label": label,
            "toxic_words": toxic_words,
            "explanation": explanation,
        }

    def extract_toxic_words(self, text: str):
        blacklist = ["hate", "stupid", "idiot", "black people", "kill", "trash"]
        found = []
        text_lower = text.lower()
        for word in blacklist:
            if re.search(rf"\b{re.escape(word)}\b", text_lower):
                found.append(word)
        return found

    def _build_prompt(self, text: str) -> str:
        return (
            "Classify the user text for hate speech. "
            "Return ONLY valid JSON with these exact keys: "
            "label (hate|offensive|neutral), "
            "toxicity_score (0-1), is_hate (true|false), "
            "explanation (brief reason in 1 sentence, or empty string if neutral).\n"
            f"Text: {text}"
        )

    def _parse_llm_response(self, response_text: str) -> dict:
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            pass
        match = re.search(r"\{.*\}", response_text, flags=re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        return {"label": "neutral", "toxicity_score": 0.0, "is_hate": False, "explanation": ""}

    def generate_with_llm(self, prompt: str):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.openrouter_model,
            "messages": [{"role": "user", "content": prompt}],
        }
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError):
            raise RuntimeError("Unexpected OpenRouter response")
