import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Call the backend generative AI API to detect hate speech in a message.
 * @param {string} text - The message text to analyze
 * @returns {Promise<{ is_hate: boolean, toxicity_score: number, label: string, toxic_words: string[], explanation: string }>}
 */
export async function detectHateSpeech(text) {
	const { data } = await axios.post(`${API_BASE}/detect-hate`, { text }, { timeout: 15000 });
	return data;
}
