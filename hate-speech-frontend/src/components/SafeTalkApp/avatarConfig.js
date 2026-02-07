/**
 * Single source of truth for avatar options and 3D shape data.
 * Change options and shapes here in SafeTalkApp; form and preview both use this.
 */

// Ethnicity / face: form labels + 3D colors
export const faceOptions = [
	{ id: "arab", label: "Arab" },
	{ id: "black", label: "Black" },
	{ id: "asian", label: "Asian" },
	{ id: "caucasian", label: "Caucasian" },
	{ id: "latino", label: "Latino" },
];

export const avatarConfigs = {
	arab: { skinTone: "#B87333", hairColor: "#1a1a1a", eyeColor: "#2C1810" },
	black: { skinTone: "#3E2723", hairColor: "#0a0a0a", eyeColor: "#1a0f0a" },
	asian: { skinTone: "#E8B88E", hairColor: "#1a0a0a", eyeColor: "#3d2817" },
	caucasian: { skinTone: "#FFE4C4", hairColor: "#5D4037", eyeColor: "#2E5090" },
	latino: { skinTone: "#C4956A", hairColor: "#2C1810", eyeColor: "#2C1810" },
};

// Hairstyle: form labels + 3D scale/height
export const hairstyleOptions = [
	{ id: "short", label: "Short" },
	{ id: "medium", label: "Medium" },
	{ id: "long", label: "Long" },
	{ id: "curly", label: "Curly" },
	{ id: "afro", label: "Afro" },
];

export const hairstyles = {
	short: { scale: 0.58, height: 0.5 },
	medium: { scale: 0.9, height: 0.82 },
	long: { scale: 1.15, height: 1.15 },
	curly: { scale: 1.28, height: 1.05 },
	afro: { scale: 1.5, height: 1.35 },
};

// Body type: form labels + 3D shape and pose (distinct silhouettes)
export const bodyTypeOptions = [
	{ id: "slim", label: "Slim" },
	{ id: "normal", label: "Normal" },
	{ id: "athletic", label: "Athletic" },
	{ id: "curvy", label: "Curvy" },
	{ id: "petite", label: "Petite" },
	{ id: "broad", label: "Broad" },
];

export const bodyTypes = {
	slim: {
		width: 0.38,
		height: 1.2,
		torsoTop: 0.24,
		torsoBottom: 0.2,
		armRadius: 0.045,
		legRadius: 0.055,
		pose: "relaxed",
		displayScale: 1.15,
	},
	normal: {
		width: 0.62,
		height: 1,
		torsoTop: 0.34,
		torsoBottom: 0.28,
		armRadius: 0.085,
		legRadius: 0.1,
		pose: "handsHips",
		displayScale: 1.2,
	},
	athletic: {
		width: 0.7,
		height: 1.12,
		torsoTop: 0.4,
		torsoBottom: 0.34,
		armRadius: 0.12,
		legRadius: 0.13,
		pose: "armsOpen",
		displayScale: 1.18,
	},
	curvy: {
		width: 0.85,
		height: 0.98,
		torsoTop: 0.48,
		torsoBottom: 0.44,
		armRadius: 0.13,
		legRadius: 0.14,
		pose: "armsOpen",
		displayScale: 1.15,
	},
	petite: {
		width: 0.5,
		height: 0.72,
		torsoTop: 0.3,
		torsoBottom: 0.28,
		armRadius: 0.065,
		legRadius: 0.075,
		pose: "handsHips",
		displayScale: 1.35,
	},
	broad: {
		width: 0.92,
		height: 0.88,
		torsoTop: 0.5,
		torsoBottom: 0.46,
		armRadius: 0.12,
		legRadius: 0.13,
		pose: "armUp",
		displayScale: 1.05,
	},
};

// Clothing: form labels + 3D color hex
export const clothingColorOptions = [
	{ id: "red", label: "Red", color: "#FF4444" },
	{ id: "blue", label: "Blue", color: "#4444FF" },
	{ id: "green", label: "Green", color: "#44FF44" },
	{ id: "black", label: "Black", color: "#2a2a2a" },
	{ id: "white", label: "White", color: "#F5F5F5" },
	{ id: "purple", label: "Purple", color: "#9944FF" },
];

export const clothingColors = {
	red: "#FF4444",
	blue: "#4444FF",
	green: "#44FF44",
	black: "#2a2a2a",
	white: "#F5F5F5",
	purple: "#9944FF",
};
