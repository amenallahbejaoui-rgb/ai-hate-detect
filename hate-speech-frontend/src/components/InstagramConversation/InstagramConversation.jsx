import React, { useState, useRef, useEffect } from "react";
import { AvatarPreviewCanvas } from "../SafeTalkApp/AvatarPreview";
import "./InstagramConversation.css";

const defaultMessages = [
	{ id: 1, text: "Hey, are you free to review the community guidelines today?", sender: "other", time: "10:30" },
	{ id: 2, text: "Sure! I can help with that 👍", sender: "me", time: "10:32" },
	{ id: 3, text: "Thanks! Let me know when you're ready", sender: "other", time: "10:33" },
];

const RECOMMENDED_RESPONSES = [
	"I don't appreciate that kind of language.",
	"that's rude , i think you need assistance with that , yr nice so be nice.",
	"I'd prefer we don't talk like that.",
];

const SHARE_PROMPT =
	" you are not alone <3 see other personal experiences and you can share your own experience .";

const InstagramConversation = ({
	contactName = "esrgh_4",
	contactAvatar = null,
	messages: initialMessages = defaultMessages,
	isHateSpeech = false,
	userAvatar = null,
	onBack,
	onNavigateToCommunity,
	className = "",
}) => {
	const [messages, setMessages] = useState(initialMessages);
	const [inputText, setInputText] = useState("");
	const [hateFlowStep, setHateFlowStep] = useState("choices"); // choices | blocked | responding | l | share_prompt
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, hateFlowStep]);

	const sendMessage = (text) => {
		const toSend = (text ?? inputText).trim();
		if (!toSend) return;
		setMessages((prev) => [
			...prev,
			{
				id: Date.now(),
				text: toSend,
				sender: "me",
				time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
			},
		]);
		setInputText("");
		if (isHateSpeech && hateFlowStep === "responding") {
			setHateFlowStep("share_prompt");
		}
	};

	const handleSend = () => {
		sendMessage();
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleBlock = () => {
		setHateFlowStep("blocked");
	};

	const handleRespond = () => {
		setHateFlowStep("responding");
	};

	const handlePickRecommendation = (text) => {
		// Send immediately: choose one option, no typing or Send button needed
		sendMessage(text);
	};

	const supportMessage = initialMessages[0]?.text || "";

	const renderAvatarSpeechBubble = (text) => (
		<div className="insta-avatar-speech">
			<div className="insta-avatar-speech-avatar">
				{userAvatar ? (
					<AvatarPreviewCanvas
						ethnicity={userAvatar.ethnicity}
						hairstyle={userAvatar.hairstyle}
						bodyType={userAvatar.bodyType}
						clothingColor={userAvatar.clothingColor}
					/>
				) : (
					<div className="insta-avatar-placeholder">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
						</svg>
					</div>
				)}
			</div>
			<div className="insta-speech-cloud">
				<p className="insta-speech-text">{text}</p>
			</div>
		</div>
	);

	return (
		<div className={`instagram-conversation ${className}`}>
			<header className="insta-conv-header">
				<button type="button" className="insta-conv-back" onClick={onBack} aria-label="Back">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
					</svg>
				</button>
				<div className="insta-conv-contact">
					<div className="insta-conv-avatar">
						{contactAvatar ? (
							<img src={contactAvatar} alt={contactName} />
						) : (
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
							</svg>
						)}
					</div>
					<span className="insta-conv-name">{contactName}</span>
				</div>
				<button type="button" className="insta-conv-more" aria-label="More options">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
					</svg>
				</button>
			</header>

			<div className="insta-conv-messages">
				{isHateSpeech ? (
					<>
						{/* Avatar with speech cloud */}
						{renderAvatarSpeechBubble(supportMessage)}

						{hateFlowStep === "choices" && (
							<div className="insta-hate-choices">
								<button type="button" className="insta-choice-btn insta-choice-block" onClick={handleBlock}>
									Block person
								</button>
								<button type="button" className="insta-choice-btn insta-choice-respond" onClick={handleRespond}>
									Respond properly
								</button>
							</div>
						)}

						{hateFlowStep === "blocked" && (
							<div className="insta-blocked-badge">blocked</div>
						)}

						{(hateFlowStep === "responding" || hateFlowStep === "share_prompt") && messages.filter((m) => m.sender === "me").length > 0 && (
							messages
								.filter((m) => m.sender === "me")
								.map((msg) => (
									<div key={msg.id} className="insta-msg insta-msg--me">
										<div className="insta-msg-bubble">
											<p className="insta-msg-text">{msg.text}</p>
											<span className="insta-msg-time">{msg.time}</span>
										</div>
									</div>
								))
						)}

						{hateFlowStep === "share_prompt" && (
							<>
								{renderAvatarSpeechBubble(SHARE_PROMPT)}
								{onNavigateToCommunity && (
									<button
										type="button"
										className="insta-community-btn"
										onClick={onNavigateToCommunity}
									>
										See Community Experiences
									</button>
								)}
							</>
						)}
						<div ref={messagesEndRef} />
					</>
				) : (
					<>
						{messages.map((msg) => (
							<div key={msg.id} className={`insta-msg insta-msg--${msg.sender}`}>
								<div className="insta-msg-bubble">
									<p className="insta-msg-text">{msg.text}</p>
									<span className="insta-msg-time">{msg.time}</span>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			<div className="insta-conv-input-wrap">
				{isHateSpeech && hateFlowStep === "responding" && (
					<div className="insta-recommendations">
						{RECOMMENDED_RESPONSES.map((rec, i) => (
							<button key={i} type="button" className="insta-rec-chip" onClick={() => handlePickRecommendation(rec)}>
								{rec}
							</button>
						))}
					</div>
				)}
				{(!isHateSpeech || hateFlowStep === "responding" || hateFlowStep === "share_prompt") && (
				<div className="insta-conv-input-row">
					<button type="button" className="insta-conv-camera" aria-label="Camera">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 15.2c1.8 0 3.2-1.4 3.2-3.2s-1.4-3.2-3.2-3.2-3.2 1.4-3.2 3.2 1.4 3.2 3.2 3.2z" />
							<path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
						</svg>
					</button>
					<input
						ref={inputRef}
						type="text"
						className="insta-conv-input"
						placeholder="Message..."
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<button
						type="button"
						className={`insta-conv-send ${inputText.trim() ? "active" : ""}`}
						onClick={handleSend}
						disabled={!inputText.trim()}
						aria-label="Send"
					>
						{inputText.trim() ? (
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
							</svg>
						) : (
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
							</svg>
						)}
					</button>
				</div>
				)}
			</div>
		</div>
	);
};

export default InstagramConversation;
