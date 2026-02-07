import React, { useState } from "react";
import "./PhoneInterface.css";
import NotificationMessage from "../NotificationMessage/NotificationMessage";
import InstagramConversation from "../InstagramConversation/InstagramConversation";
import { AvatarPreviewCanvas } from "../SafeTalkApp/AvatarPreview";
import chatIcon from "./icons/chat.svg";
import reportsIcon from "./icons/reports.svg";
import settingsIcon from "./icons/settings.svg";
import trendsIcon from "./icons/trends.svg";
import auditIcon from "./icons/audit.svg";
import helpIcon from "./icons/help.svg";
import inboxIcon from "./icons/inbox.svg";
import phoneIcon from "./icons/phone.svg";
import messagesIcon from "./icons/messages.svg";
import browserIcon from "./icons/browser.svg";
import musicIcon from "./icons/music.svg";

const SAFE_TALK_LOGO = process.env.PUBLIC_URL + "/bee.jpeg";

const PhoneInterface = ({ onSafeTalkClick, onNavigateToCommunity, userAvatar }) => {
	const [conversation, setConversation] = useState(null);

	const handleSafeTalkClick = () => {
		onSafeTalkClick();
	};

	const handleMessageClick = (messageData) => {
		const firstMessageText = messageData.isHateSpeech
			? "I think you got hate messages. You don't deserve that, you're the best. Do you need help how to respond?"
			: messageData.displayText;
		setConversation({
			contactName: messageData.sender,
			contactAvatar: null,
			isHateSpeech: messageData.isHateSpeech || false,
			userAvatar,
			messages: [
				{
					id: 1,
					text: firstMessageText,
					sender: "other",
					time: messageData.time || "20:02",
				},
			],
		});
	};

	const handleBackFromConversation = () => {
		setConversation(null);
	};

	return (
		<section className="phone-showcase" aria-label="Mobile home screen">
			<div className="phone-surface">
				<div className="phone-glow" aria-hidden="true" />
				<div className="phone-body">
					<div className="phone-bezel">
						<div className="phone-notch" aria-hidden="true" />
						<div className="phone-screen">
							<header className="status-bar">
								<span className="status-time">9:41</span>
								<div className="status-icons" aria-hidden="true">
									<span className="status-signal" />
									<span className="status-wifi" />
									<span className="status-battery" />
								</div>
							</header>
						{conversation ? (
							<InstagramConversation
								contactName={conversation.contactName}
								contactAvatar={conversation.contactAvatar}
								messages={conversation.messages}
								isHateSpeech={conversation.isHateSpeech}
								userAvatar={conversation.userAvatar}
								onBack={handleBackFromConversation}
								onNavigateToCommunity={onNavigateToCommunity}
								className="phone-conv-overlay"
							/>
						) : (
							<>
						<NotificationMessage userAvatar={userAvatar} onMessageClick={handleMessageClick} />
						<div className="home-header">
								<p className="home-day">Friday</p>
								<h1 className="home-time">09:41</h1>
								<p className="home-date">Feb 6</p>
							</div>

							{userAvatar && (
								<div className="user-profile">
									<div className="avatar-preview-small">
										<AvatarPreviewCanvas
											ethnicity={userAvatar.ethnicity}
											hairstyle={userAvatar.hairstyle}
											bodyType={userAvatar.bodyType}
											clothingColor={userAvatar.clothingColor}
										/>
									</div>
									<div className="profile-info">
										<p className="profile-name">{userAvatar.name}</p>
										<span className="profile-label">Safe Talk Avatar</span>
									</div>
								</div>
							)}

							<div className="search-pill" role="search">
								<span className="search-dot" aria-hidden="true" />
								<span className="search-text">Search apps</span>
							</div>

							<div className="app-grid" aria-label="Apps">
								<button
									className="app-tile app-a"
									type="button"
									onClick={handleSafeTalkClick}
								>
									<span className="app-icon">
										<img className="safe-talk-logo" src={SAFE_TALK_LOGO} alt="Safe Talk" />
									</span>
									<span className="app-label">Safe Talk</span>
								</button>
								<button className="app-tile app-b" type="button">
									<span className="app-icon">
										<img src={chatIcon} alt="Chat" />
									</span>
									<span className="app-label">Chat</span>
								</button>
								<button className="app-tile app-c" type="button">
									<span className="app-icon">
										<img src={reportsIcon} alt="Reports" />
									</span>
									<span className="app-label">Reports</span>
								</button>
								<button className="app-tile app-d" type="button">
									<span className="app-icon">
										<img src={settingsIcon} alt="Settings" />
									</span>
									<span className="app-label">Settings</span>
								</button>
								<button className="app-tile app-e" type="button">
									<span className="app-icon">
										<img src={trendsIcon} alt="Trends" />
									</span>
									<span className="app-label">Trends</span>
								</button>
								<button className="app-tile app-f" type="button">
									<span className="app-icon">
										<img src={auditIcon} alt="Audit" />
									</span>
									<span className="app-label">Audit</span>
								</button>
								<button className="app-tile app-g" type="button">
									<span className="app-icon">
										<img src={helpIcon} alt="Help" />
									</span>
									<span className="app-label">Help</span>
								</button>
								<button className="app-tile app-h" type="button">
									<span className="app-icon">
										<img src={inboxIcon} alt="Inbox" />
									</span>
									<span className="app-label">Inbox</span>
								</button>
							</div>

							<nav className="dock" aria-label="Dock">
								<button className="dock-item" type="button">
									<span className="dock-icon">
										<img src={phoneIcon} alt="Phone" />
									</span>
									<span className="dock-label">Phone</span>
								</button>
								<button className="dock-item" type="button">
									<span className="dock-icon">
										<img src={messagesIcon} alt="Messages" />
									</span>
									<span className="dock-label">Messages</span>
								</button>
								<button className="dock-item" type="button">
									<span className="dock-icon">
										<img src={browserIcon} alt="Browser" />
									</span>
									<span className="dock-label">Browser</span>
								</button>
								<button className="dock-item" type="button">
									<span className="dock-icon">
										<img src={musicIcon} alt="Music" />
									</span>
									<span className="dock-label">Music</span>
								</button>
							</nav>
							</>
						)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PhoneInterface;
