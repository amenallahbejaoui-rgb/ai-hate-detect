import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder } from '@react-three/drei';
import { avatarConfigs } from './avatarConfig';

const faceExpressions = {
	neutral: { mouthScale: 1, eyeScale: 1, browRotation: 0 },
	happy: { mouthScale: 1.3, eyeScale: 0.85, browRotation: -0.12 },
	cool: { mouthScale: 0.8, eyeScale: 0.7, browRotation: 0 },
	sad: { mouthScale: 0.7, eyeScale: 1.1, browRotation: 0.18 },
	excited: { mouthScale: 1.4, eyeScale: 1.15, browRotation: -0.2 },
};

function AvatarHeadPreview({ ethnicity = 'arab', face = 'neutral' }) {
	const groupRef = useRef();
	const config = avatarConfigs[ethnicity];
	const expression = faceExpressions[face];

	useFrame((state, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.4;
		}
	});

	const skinMat = <meshToonMaterial color={config.skinTone} />;
	const hairMat = <meshToonMaterial color={config.hairColor} />;

	return (
		<group ref={groupRef}>
			{/* Head - Bitmoji round */}
			<Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
				{skinMat}
			</Sphere>

			{/* Hair - Snapchat volume */}
			<Sphere args={[1.12, 32, 16]} position={[0, 0.35, 0]} scale={[1, 0.7, 1]}>
				{hairMat}
			</Sphere>

			{/* Eyes - large Bitmoji */}
			<Sphere args={[0.18 * expression.eyeScale, 16, 16]} position={[-0.35, 0.22, 0.88]}>
				<meshToonMaterial color="white" />
			</Sphere>
			<Sphere args={[0.18 * expression.eyeScale, 16, 16]} position={[0.35, 0.22, 0.88]}>
				<meshToonMaterial color="white" />
			</Sphere>

			{/* Pupils */}
			<Sphere args={[0.1, 16, 16]} position={[-0.35, 0.22, 0.98]}>
				<meshToonMaterial color={config.eyeColor} />
			</Sphere>
			<Sphere args={[0.1, 16, 16]} position={[0.35, 0.22, 0.98]}>
				<meshToonMaterial color={config.eyeColor} />
			</Sphere>

			{/* Smile - Bitmoji curved */}
			<Cylinder args={[0.2 * expression.mouthScale, 0.2 * expression.mouthScale, 0.06, 24, 1, false, 0, Math.PI * 0.6]} position={[0, -0.35, 0.92]} rotation={[0, 0, Math.PI]}>
				<meshToonMaterial color="#8B4545" />
			</Cylinder>

			{/* Eyebrows */}
			<Box args={[0.28, 0.06, 0.04]} position={[-0.35, 0.52, 0.88]} rotation={[0, 0, expression.browRotation]}>
				{hairMat}
			</Box>
			<Box args={[0.28, 0.06, 0.04]} position={[0.35, 0.52, 0.88]} rotation={[0, 0, -expression.browRotation]}>
				{hairMat}
			</Box>

			{/* Nose - subtle */}
			<Sphere args={[0.08, 12, 12]} position={[0, -0.02, 0.95]}>
				{skinMat}
			</Sphere>
		</group>
	);
}

export function FacePreviewCanvas({ ethnicity, face }) {
	return (
		<Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 0, 2.5], fov: 50 }} gl={{ antialias: true }}>
			<ambientLight intensity={0.8} />
			<directionalLight position={[5, 5, 5]} intensity={0.9} />
			<pointLight position={[-3, 3, 3]} intensity={0.4} />
			<AvatarHeadPreview ethnicity={ethnicity} face={face} />
		</Canvas>
	);
}
