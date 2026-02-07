"""Test script for the hate speech detection API. Run the backend first: uvicorn main:app --port 8000"""
import requests

API_URL = "http://localhost:8000"


def test_health():
    """Test the health endpoint."""
    r = requests.get(f"{API_URL}/health", timeout=5)
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("✓ Health check OK:", r.json())


def test_detect(text: str, label: str = ""):
    """Test the detect-hate endpoint."""
    r = requests.post(f"{API_URL}/detect-hate", json={"text": text}, timeout=30)
    assert r.status_code == 200, f"Detect failed: {r.status_code} - {r.text}"
    data = r.json()
    print(f"\n{'─'*60}")
    print(f"Text: {text[:80]}{'...' if len(text) > 80 else ''}")
    print(f"Result: is_hate={data.get('is_hate')}, label={data.get('label')}, score={data.get('toxicity_score')}")
    if data.get("explanation"):
        print(f"Explanation: {data['explanation']}")
    if data.get("toxic_words"):
        print(f"Toxic words: {data['toxic_words']}")
    return data


if __name__ == "__main__":
    print("Testing Hate Speech Detection API\n")
    test_health()

    # Test 1: Neutral message
    test_detect("Hey, are you free to review the community guidelines today?")

    # Test 2: Potentially harmful (may vary by model)
    test_detect("You are so stupid and trash")

    # Test 3: Neutral with emojis
    test_detect("Thanks for the update! 😊👍")

    print("\n" + "─" * 60)
    print("All tests completed.")
