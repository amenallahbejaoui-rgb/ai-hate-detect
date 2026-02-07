import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Box } from '@react-three/drei';
import './Avatar.css';

const avatarConfigs = {
	arab: { skinTone: '#C68642', hairColor: '#1a1a1a', eyeColor: '#2C1810', name: 'Arab Avatar' },
	black: { skinTone: '#5D4037', hairColor: '#0a0a0a', eyeColor: '#1a0f0a', name: 'Black Avatar' },
	asian: { skinTone: '#F0C294', hairColor: '#000000', eyeColor: '#3d2817', name: 'Asian Avatar' },
	caucasian: { skinTone: '#FFE0BD', hairColor: '#6B4423', eyeColor: '#4A90E2', name: 'Caucasian Avatar' },
	latino: { skinTone: '#D4A574', hairColor: '#2C1810', eyeColor: '#3d2817', name: 'Latino Avatar' },
};

function AvatarHead({ config, rotation }) {
	const groupRef = useRef();

	useFrame((state, delta) => {
		if (groupRef.current && rotation) {
			groupRef.current.rotation.y += delta * 0.3;
		}
	});

	return (
		<group ref={groupRef}>
			{/* Head - Bitmoji round, smooth shape */}
			<Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
				<meshToonMaterial color={config.skinTone} />
			</Sphere>

			{/* Eyes - large Bitmoji-style */}
			<Sphere args={[0.15, 16, 16]} position={[-0.32, 0.22, 0.82]}>
				<meshToonMaterial color="white" />
			</Sphere>
			<Sphere args={[0.15, 16, 16]} position={[0.32, 0.22, 0.82]}>
				<meshToonMaterial color="white" />
			</Sphere>

			{/* Pupils */}
			<Sphere args={[0.07, 16, 16]} position={[-0.32, 0.22, 0.92]}>
				<meshToonMaterial color={config.eyeColor} />
			</Sphere>
			<Sphere args={[0.07, 16, 16]} position={[0.32, 0.22, 0.92]}>
				<meshToonMaterial color={config.eyeColor} />
			</Sphere>

			{/* Nose - subtle Bitmoji bump */}
			<Sphere args={[0.12, 16, 16]} position={[0, -0.05, 0.9]}>
				<meshToonMaterial color={config.skinTone} />
			</Sphere>

			{/* Smile - Bitmoji curved */}
			<Cylinder args={[0.25, 0.25, 0.06, 24, 1, false, 0, Math.PI * 0.6]} position={[0, -0.48, 0.78]} rotation={[0, 0, Math.PI]}>
				<meshToonMaterial color="#8B4545" />
			</Cylinder>

			{/* Hair - Snapchat-style volume, hemisphere cap */}
			<Sphere args={[1.08, 32, 16]} position={[0, 0.55, 0]} scale={[1, 0.65, 1]}>
				<meshToonMaterial color={config.hairColor} />
			</Sphere>

			{/* Ears */}
			<Sphere args={[0.22, 16, 16]} position={[-0.98, 0, 0]}>
				<meshToonMaterial color={config.skinTone} />
			</Sphere>
			<Sphere args={[0.22, 16, 16]} position={[0.98, 0, 0]}>
				<meshToonMaterial color={config.skinTone} />
			</Sphere>
		</group>
	);
}

const Avatar = ({ name = 'User', race = 'arab', size = 200, enableRotation = true, showName = true, className = '' }) => {
	const config = avatarConfigs[race.toLowerCase()] || avatarConfigs.arab;

	return (
		<div className={`avatar-container avatar-bitmoji ${className}`} style={{ width: size, height: size }}>
			<Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true }}>
				<ambientLight intensity={0.7} />
				<directionalLight position={[5, 5, 5]} intensity={0.9} />
				<pointLight position={[-4, 4, 4]} intensity={0.4} />
				<pointLight position={[0, -2, 2]} intensity={0.2} />
				<AvatarHead config={config} rotation={enableRotation} />
				<OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
			</Canvas>
			{showName && <div className="avatar-name">{name}</div>}
		</div>
	);
};

export default Avatar;
