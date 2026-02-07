import React, { useState, useEffect } from "react";
import "./SafeTalkApp.css";
import { AvatarPreviewCanvas } from "./AvatarPreview";
import {
	faceOptions,
	hairstyleOptions,
	bodyTypeOptions,
	clothingColorOptions,
} from "./avatarConfig";
import BeKind from "../BeKind/BeKind";
import OurObjectives from "../OurObjectives/OurObjectives";
import OurCommunityExperiences from "../OurCommunityExperiences/OurCommunityExperiences";

const AVATAR_STORAGE_KEY = "safetalk_avatar";

const NAV_TABS = [
	{ id: "bekind", label: "Be Kind" },
	{ id: "objectives", label: "Our Objectives" },
	{ id: "community", label: "Our Community" },
	{ id: "avatar", label: "Avatar" },
];

const SafeTalkApp = ({ onBack, onAvatarCreated, initialTab, onInitialTabConsumed }) => {
	const [activeTab, setActiveTab] = useState("avatar");

	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab);
			onInitialTabConsumed?.();
		}
	}, [initialTab, onInitialTabConsumed]);
	const [formData, setFormData] = useState({
		name: "",
		ethnicity: "arab",
		hairstyle: "medium",
		bodyType: "normal",
		clothingColor: "blue",
	});

	const [submittedAvatar, setSubmittedAvatar] = useState(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				setFormData({
					name: parsed.name || "",
					ethnicity: parsed.ethnicity || "arab",
					hairstyle: parsed.hairstyle || "medium",
					bodyType: parsed.bodyType || "normal",
					clothingColor: parsed.clothingColor || "blue",
				});
			}
		} catch (e) {
			console.warn("Failed to load saved avatar:", e);
		}
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.name) {
			setSubmittedAvatar({
				name: formData.name,
				ethnicity: formData.ethnicity,
				hairstyle: formData.hairstyle,
				bodyType: formData.bodyType,
				clothingColor: formData.clothingColor,
			});
		}
	};

	const handleReset = () => {
		setFormData({
			name: "",
			ethnicity: "arab",
			hairstyle: "medium",
			bodyType: "normal",
			clothingColor: "blue",
		});
		setSubmittedAvatar(null);
	};

	return (
		<div className="safetalk-app">
			<header className="safetalk-header">
				<button className="back-btn" onClick={onBack}>
					← Back
				</button>
				<div className="safetalk-header-brand">
					<img src={process.env.PUBLIC_URL + "/bee.jpeg"} alt="" className="safetalk-logo" aria-hidden />
					<h1>Safe Talk</h1>
				</div>
				<div />
			</header>

			<nav className="safetalk-navbar">
				{NAV_TABS.map((tab) => (
					<button
						key={tab.id}
						type="button"
						className={`safetalk-nav-btn ${activeTab === tab.id ? "active" : ""}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</nav>

			{activeTab === "bekind" && <BeKind />}
			{activeTab === "objectives" && <OurObjectives />}
			{activeTab === "community" && <OurCommunityExperiences />}

			{activeTab === "avatar" && (
			<div className="safetalk-container">
				<div className="form-section">
					<h2>Create Your Bitmoji-Style Avatar</h2>
					<form onSubmit={handleSubmit} className="safetalk-form">
						<div className="form-group">
							<label htmlFor="name">Avatar Name:</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter avatar name"
								required
							/>
						</div>

						<div className="form-group">
							<label>Select Your Avatar Ethnicity:</label>
							<div className="face-selector">
								{faceOptions.map((ethnicity) => (
									<button
										key={ethnicity.id}
										type="button"
										className={`face-option ${formData.ethnicity === ethnicity.id ? "active" : ""}`}
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												ethnicity: ethnicity.id,
											}))
										}
										title={ethnicity.label}
									>
										<span className="face-label">{ethnicity.label}</span>
									</button>
								))}
							</div>
						</div>

						<div className="form-group">
							<label>Hairstyle:</label>
							<div className="option-selector">
								{hairstyleOptions.map((style) => (
									<button
										key={style.id}
										type="button"
										className={`option-btn ${formData.hairstyle === style.id ? "active" : ""}`}
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												hairstyle: style.id,
											}))
										}
									>
										{style.label}
									</button>
								))}
							</div>
						</div>

						<div className="form-group">
							<label>Body Type:</label>
							<div className="option-selector">
								{bodyTypeOptions.map((body) => (
									<button
										key={body.id}
										type="button"
										className={`option-btn ${formData.bodyType === body.id ? "active" : ""}`}
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												bodyType: body.id,
											}))
										}
									>
										{body.label}
									</button>
								))}
							</div>
						</div>

						<div className="form-group">
							<label>Clothing Color:</label>
							<div className="color-selector">
								{clothingColorOptions.map((color) => (
									<button
										key={color.id}
										type="button"
										className={`color-btn ${formData.clothingColor === color.id ? "active" : ""}`}
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												clothingColor: color.id,
											}))
										}
										style={{ backgroundColor: color.color }}
										title={color.label}
									/>
								))}
							</div>
						</div>

						<div className="form-actions">
							<button type="submit" className="btn-primary">
								Create Avatar
							</button>
							<button type="button" className="btn-secondary" onClick={handleReset}>
								Reset
							</button>
						</div>
					</form>
				</div>

				<div className={`avatar-section ${submittedAvatar ? "submitted" : ""}`}>
					<h2>{submittedAvatar ? "Your Avatar" : "Live Preview"}</h2>
					<div className="avatar-display">
						<AvatarPreviewCanvas
							ethnicity={submittedAvatar?.ethnicity ?? formData.ethnicity}
							hairstyle={submittedAvatar?.hairstyle ?? formData.hairstyle}
							bodyType={submittedAvatar?.bodyType ?? formData.bodyType}
							clothingColor={submittedAvatar?.clothingColor ?? formData.clothingColor}
						/>
					</div>
					{submittedAvatar ? (
						<>
							<div className="avatar-info">
								<p><strong>Name:</strong> {submittedAvatar.name}</p>
								<p><strong>Ethnicity:</strong> {submittedAvatar.ethnicity}</p>
								<p><strong>Hairstyle:</strong> {submittedAvatar.hairstyle}</p>
								<p><strong>Body Type:</strong> {submittedAvatar.bodyType}</p>
								<p><strong>Clothing:</strong> {submittedAvatar.clothingColor}</p>
							</div>
							<div className="avatar-actions">
								<button className="btn-save-avatar" onClick={() => onAvatarCreated?.(submittedAvatar)}>
									Save & Use Avatar
								</button>
								<button className="btn-edit-avatar" onClick={handleReset}>Edit Avatar</button>
							</div>
						</>
					) : (
						<p className="preview-hint">Customize your avatar — changes appear in real time</p>
					)}
				</div>
			</div>
			)}
		</div>
	);
};

export default SafeTalkApp;
                                                                