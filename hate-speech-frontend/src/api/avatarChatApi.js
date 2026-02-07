import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Send conversation to backend; backend proxies to Ollama and returns avatar reply.
 * @param {Array<{ role: 'user' | 'assistant' | 'system', content: string }>} messages
 * @param {string} [model] - Optional Ollama model (default: phi)
 * @returns {Promise<{ content: string }>}
 */
export async function chatWithAvatar(messages, model = null) {
	const payload = { messages };
	if (model) payload.model = model;
	const { data } = await axios.post(`${API_BASE}/chat-avatar`, payload, { timeout: 60000 });
	return data;
}
