import React, { useState, useEffect, useRef } from "react";
import { AvatarPreviewCanvas } from "../SafeTalkApp/AvatarPreview";
import { chatWithAvatar } from "../../api/avatarChatApi";
import "./OurCommunityExperiences.css";

const STORAGE_KEY = "community-experiences-racism";
const AVATAR_STORAGE_KEY = "safetalk_avatar";

const AVATAR_GREETING =
	"Hello ! do you wanna talk about what happened ,you seem sad ,or feel free to dm me ,i'm here to help";

const initialChatMessages = () => [
	{ id: 0, role: "assistant", content: AVATAR_GREETING },
];

const AnonymousIcon = () => (
	<svg className="anon-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
	</svg>
);

const DEFAULT_EXPERIENCES = [
	{
		id: 1,
		timestamp: "23:15, 2/6/2026",
		name: "anonymous: mangoooo67 ",
		text: "I have personally experienced hate speech, and it has been one of the most painful things I have gone through. Words can hurt deeply, even when people say them casually or online. At times, the hateful comments made me feel small, insecure, and misunderstood. I started to doubt myself and question my worth because of what others were saying.\n\nThere were moments when I felt alone and overwhelmed, as if the negativity was louder than my own voice. Hate speech did not just affect my mood — it affected my confidence, my motivation, and the way I saw myself. It was difficult to stay positive when I kept hearing messages that made me feel rejected or judged.\n\nHowever, using this application helped change the way I dealt with hate speech. It gave me a safe space to express my feelings, reflect on my experiences, and find supportive and positive perspectives. Through this app, I learned that hateful words do not define who I am. I began to rebuild my confidence and focus on my strengths instead of the negativity.\n\nToday, I still remember the pain of those experiences, but they no longer control me. This application helped me transform hurt into strength and reminded me that my voice, my identity, and my value matter. Instead of letting hate speech silence me, I now use my experience to grow, heal, and move forward with more confidence and self-respect.",
	},
	{
		id: 2,
		timestamp: "23:50, 2/6/2026",
		name: "nonymous: spongebob big guy ",
		text: "I have experienced hate speech, and it hurt me deeply, making me feel insecure and doubting my worth. At first, it was overwhelming, and the negativity seemed louder than my own voice.\n\nUsing this application changed that. It gave me a safe space to express my feelings and helped me realize that hateful words don't define me. I regained my confidence and learned to focus on my strengths instead of the negativity. Now, I can move forward with more self-respect and resilience.",
	},
	{
		id: 3,
		timestamp: "23:56, 2/6/2026",
		name: "nonymous: crunchy crocodile ",
		text: "A friend of mine once faced severe online harassment after sharing her artwork on social media. People sent hurtful messages criticizing her skills, her appearance, and even her personality. At first, she felt overwhelmed, anxious, and even scared to post anything online again. She started doubting herself and wondered if expressing herself publicly was worth the pain.\n\nOver time, she found support through online communities and mental health resources that helped her cope. She also began using moderation tools to filter out abusive comments and focus on constructive feedback. This support system helped her regain confidence and continue sharing her art without letting the harassment control her life. She learned that while some people may try to bring you down online, there are ways to protect yourself and find people who uplift you.",
	},
];

const loadFromStorage = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_EXPERIENCES;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_EXPERIENCES;
	} catch {
		return DEFAULT_EXPERIENCES;
	}
};

const saveToStorage = (experiences) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
	} catch (e) {
		console.warn("Could not save experiences to storage", e);
	}
};

const OurCommunityExperiences = () => {
	const [experiences, setExperiences] = useState(() => loadFromStorage());
	const [formName, setFormName] = useState("");
	const [formText, setFormText] = useState("");
	const [formAnonymous, setFormAnonymous] = useState(true);
	const [submitted, setSubmitted] = useState(false);
	const [storedAvatar, setStoredAvatar] = useState(null);
	const [chatBubbleOpen, setChatBubbleOpen] = useState(false);
	const [chatMessages, setChatMessages] = useState(initialChatMessages);
	const [chatInput, setChatInput] = useState("");
	const [chatLoading, setChatLoading] = useState(false);
	const [chatError, setChatError] = useState(null);
	const chatEndRef = useRef(null);
	const chatScrollRef = useRef(null);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed && (parsed.ethnicity || parsed.hairstyle != null)) setStoredAvatar(parsed);
			}
		} catch (e) {
			// ignore
		}
	}, []);

	useEffect(() => {
		if (experiences.length > 0) saveToStorage(experiences);
	}, [experiences]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const text = formText.trim();
		if (!text) return;
		const displayName = formAnonymous ? "anonymous" : `nonymous: ${formName.trim() || "anonymous"}`;
		const now = new Date();
		const timestamp = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + ", " + now.toLocaleDateString();
		const newExp = {
			id: Date.now(),
			timestamp,
			name: displayName,
			text,
		};
		setExperiences((prev) => [newExp, ...prev]);
		setFormText("");
		setFormName("");
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
	};

	const handleSendChat = async () => {
		const text = chatInput.trim();
		if (!text || chatLoading) return;
		setChatError(null);
		const userMsg = { id: Date.now(), role: "user", content: text };
		setChatMessages((prev) => [...prev, userMsg]);
		setChatInput("");
		setChatLoading(true);
		try {
			const apiMessages = [...chatMessages, userMsg].map((m) => ({
				role: m.role,
				content: m.content,
			}));
			const { content } = await chatWithAvatar(apiMessages);
			setChatMessages((prev) => [...prev, { id: Date.now(), role: "assistant", content }]);
		} catch (err) {
			const msg = err.response?.data?.detail || err.message || "Could not reach the chat. Is the backend running and Ollama running (e.g. ollama run phi)?";
			setChatError(msg);
			setChatMessages((prev) => prev.slice(0, -1));
			setChatInput(text);
		} finally {
			setChatLoading(false);
		}
	};

	const handleChatKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendChat();
		}
	};

	const unreadCount = chatBubbleOpen ? 0 : (chatMessages.filter((m) => m.role === "assistant").length > 0 ? 1 : 0);

	return (
		<div className="our-community-experiences">
			<h1 className="our-community-title">Our Community Experiences</h1>

			<form className="experience-form" onSubmit={handleSubmit}>
				<h2 className="experience-form-title">Post your experience (racism / hate speech)</h2>
				<label className="experience-form-label">
					Name
					<input
						type="text"
						className="experience-form-input"
						placeholder="Your name or nickname"
						value={formName}
						onChange={(e) => setFormName(e.target.value)}
						maxLength={80}
					/>
				</label>
				<label className="experience-form-label experience-form-label--row">
					<input
						type="checkbox"
						checked={formAnonymous}
						onChange={(e) => setFormAnonymous(e.target.checked)}
					/>
					<span>Post anonymously</span>
				</label>
				<label className="experience-form-label">
					Your experience
					<textarea
						className="experience-form-textarea"
						placeholder="Share your experience with racism or hate speech. Your story can help others."
						value={formText}
						onChange={(e) => setFormText(e.target.value)}
						rows={5}
						required
					/>
				</label>
				<button type="submit" className="experience-form-submit" disabled={!formText.trim()}>
					{submitted ? "Thank you — shared" : "Share experience"}
				</button>
			</form>

			<div className="our-community-content">
				{experiences.map((exp) => (
					<div key={exp.id} className="community-experience-card">
						<div className="experience-icon-wrap">
							<AnonymousIcon />
						</div>
						<div className="experience-body">
							<div className="experience-meta">
								<span className="experience-time">[{exp.timestamp}]</span>
								<span className="experience-name">{exp.name}:</span>
							</div>
							<p className="experience-text">{exp.text}</p>
						</div>
					</div>
				))}
			</div>

			{storedAvatar && (
				<div className={`community-chat-bubble ${chatBubbleOpen ? "community-chat-bubble--open" : ""}`}>
					{chatBubbleOpen ? (
						<div className="community-chat-bubble-inner">
							<button
								type="button"
								className="community-chat-close"
								onClick={() => setChatBubbleOpen(false)}
								aria-label="Close conversation"
							>
								×
							</button>
							<div className="community-chat-avatar-wrap">
								<AvatarPreviewCanvas
									ethnicity={storedAvatar.ethnicity}
									hairstyle={storedAvatar.hairstyle}
									bodyType={storedAvatar.bodyType}
									clothingColor={storedAvatar.clothingColor}
								/>
							</div>
							<div className="community-chat-body">
								<div className="community-chat-messages" ref={chatScrollRef}>
									{chatMessages.map((msg) => (
										<div
											key={msg.id}
											className={`community-chat-msg community-chat-msg--${msg.role === "user" ? "me" : "avatar"}`}
										>
											<span className="community-chat-name">
												{msg.role === "user" ? "You" : storedAvatar.name || "Your avatar"}
											</span>
											<p className="community-chat-text">{msg.content}</p>
										</div>
									))}
									{chatLoading && (
										<div className="community-chat-msg community-chat-msg--avatar community-chat-typing">
											<span className="community-chat-name">{storedAvatar.name || "Your avatar"}</span>
											<p className="community-chat-text">…</p>
										</div>
									)}
									<div ref={chatEndRef} />
								</div>
								{chatError && (
									<p className="community-chat-error">{chatError}</p>
								)}
								<div className="community-chat-input-wrap">
									<textarea
										className="community-chat-input"
										placeholder="Type a message…"
										value={chatInput}
										onChange={(e) => setChatInput(e.target.value)}
										onKeyDown={handleChatKeyDown}
										rows={1}
										disabled={chatLoading}
									/>
									<button
										type="button"
										className="community-chat-send"
										onClick={handleSendChat}
										disabled={!chatInput.trim() || chatLoading}
										aria-label="Send"
									>
										Send
									</button>
								</div>
							</div>
						</div>
					) : (
						<button
							type="button"
							className="community-chat-trigger"
							onClick={() => setChatBubbleOpen(true)}
							aria-label={unreadCount > 0 ? `Open conversation with your avatar (${unreadCount} unread)` : "Open conversation with your avatar"}
						>
							<div className="community-chat-trigger-avatar">
								<AvatarPreviewCanvas
									ethnicity={storedAvatar.ethnicity}
									hairstyle={storedAvatar.hairstyle}
									bodyType={storedAvatar.bodyType}
									clothingColor={storedAvatar.clothingColor}
								/>
							</div>
							<span className="community-chat-online-dot" aria-hidden="true" />
							{unreadCount > 0 && (
								<span className="community-chat-unread-badge">{unreadCount}</span>
							)}
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default OurCommunityExperiences;
