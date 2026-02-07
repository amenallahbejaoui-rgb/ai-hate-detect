import React, { useEffect, useState } from "react";
import { detectHateSpeech } from "../../api/hateSpeechApi";
import { AvatarPreviewCanvas } from "../SafeTalkApp/AvatarPreview";
import "./NotificationMessage.css";

const messages = [
  {
    id: 1,
    sender: "charlie kirk",
    avatar: "S",
    app: "Instagram",
    time: "20:02",
    text: "sup twin wanna hang out?",
    emojis: "😊😂😍",							
  },
  {
    id: 2,
    sender: "esrgh_4",
    avatar: "E",
    app: "Instagram",
    time: "20:02",
    text: "I hate you, you are stupid",
    emojis: "😜😔👻🎉💖",
  }

];

const encryptMessage = (text) => {
	const len = Math.max(10, text.length);
	return "*".repeat(len);
};

const NotificationMessage = ({ userAvatar, onMessageClick }) => {
	const [visibleIndex, setVisibleIndex] = useState(-1);
	const [liked, setLiked] = useState(false);
	const [replyMode, setReplyMode] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [detection, setDetection] = useState({ loading: true, is_hate: false, explanation: "" });

	useEffect(() => {
		const firstTimer = setTimeout(() => setVisibleIndex(0), 2000);
		const secondTimer = setTimeout(() => setVisibleIndex(1), 12000);
		return () => {
			clearTimeout(firstTimer);
			clearTimeout(secondTimer);
		};
	}, []);

	useEffect(() => {
		setLiked(false);
		setReplyMode(false);
		setReplyText("");
	}, [visibleIndex]);

	useEffect(() => {
		if (visibleIndex < 0 || visibleIndex >= messages.length) return;
		const msg = messages[visibleIndex];
		const textToAnalyze = msg.emojis ? `${msg.text} ${msg.emojis}` : msg.text;
		setDetection({ loading: true, is_hate: false, explanation: "" });
		detectHateSpeech(textToAnalyze)
			.then((res) => {
				setDetection({
					loading: false,
					is_hate: res.is_hate,
					explanation: res.explanation || "",
				});
			})
			.catch(() => {
				setDetection({ loading: false, is_hate: false, explanation: "Detection unavailable" });
			});
	}, [visibleIndex]);

	const msg = visibleIndex >= 0 && visibleIndex < messages.length ? messages[visibleIndex] : null;
	const fullText = msg ? (msg.emojis ? `${msg.text} ${msg.emojis}` : msg.text) : "";
	const isSecondMessage = visibleIndex === 1;
	const displayText = msg && (isSecondMessage || (!detection.loading && detection.is_hate)) ? encryptMessage(fullText) : fullText;

	const handleLike = () => {
		setLiked(true);
	};

	const handleReplyClick = () => {
		setReplyMode(true);
	};

	const handleSendReply = () => {
		if (replyText.trim()) {
			setReplyText("");
			setReplyMode(false);
		}
	};

	const handleNotificationClick = () => {
		if (msg && onMessageClick) {
			onMessageClick({
				...msg,
				displayText,
				isHateSpeech: isSecondMessage || (!detection.loading && detection.is_hate),
			});
		}
	};

	return (
		<>
			{msg && (
				<div
					className="lock-notification instagram-style"
					role="button"
					tabIndex={0}
					onClick={handleNotificationClick}
					onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNotificationClick()}
					aria-label={`Open conversation with ${msg.sender}`}
				>
					<div className="notification-content">
						<div className="notification-header">
							<div className="avatar-container instagram-avatar">
								<div className="avatar-placeholder">
									<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
									</svg>
								</div>
								<div className="instagram-badge" aria-label="Instagram" />
							</div>
							<div className="header-text">
								<span className="sender-username">{msg.sender}</span>
								<span className="time-stamp">{msg.time}</span>
							</div>
							<button type="button" className="expand-caret" aria-label="Expand">
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
								</svg>
							</button>
						</div>

						<div className="message-content">
							<div className="message-row">
								<p className={`message-text ${isSecondMessage || detection.is_hate ? "encrypted" : ""}`}>{displayText}</p>
								{!detection.loading && !detection.is_hate && !isSecondMessage && (
									<span className="green-tick" aria-label="Message safe">✓</span>
								)}
							</div>
						</div>

						{isSecondMessage && (
							<div className="supportive-message">
								<div className="supportive-avatar">
									{userAvatar ? (
										<AvatarPreviewCanvas
											ethnicity={userAvatar.ethnicity}
											hairstyle={userAvatar.hairstyle}
											bodyType={userAvatar.bodyType}
											clothingColor={userAvatar.clothingColor}
										/>
									) : (
										<div className="avatar-placeholder supportive-placeholder">
											<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
												<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
											</svg>
										</div>
									)}
								</div>
								<p className="supportive-text">you receive a hate speech</p>
							</div>
						)}

						{replyMode ? (
							<div className="reply-section">
								<input
									type="text"
									className="reply-input"
									placeholder="Répondre..."
									value={replyText}
									onChange={(e) => setReplyText(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
								/>
								<button
									type="button"
									className="send-btn"
									onClick={handleSendReply}
									disabled={!replyText.trim()}
									aria-label="Envoyer"
								>
									Envoyer
								</button>
							</div>
						) : (
							<div className="action-buttons" onClick={(e) => e.stopPropagation()}>
								<button
									type="button"
									className={`action-btn ${liked ? "liked" : ""}`}
									onClick={handleLike}
									disabled={liked}
								>
									{liked ? "Message aimé" : "J'aime"}
								</button>
								<div className="action-divider" />
								<button type="button" className="action-btn" onClick={handleReplyClick}>
									Répondre
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default NotificationMessage;
