import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, ContactShadows } from '@react-three/drei';
import { avatarConfigs, hairstyles, bodyTypes, clothingColors } from './avatarConfig';

// Arm positions per pose – exaggerated so each body type looks clearly different
const poseArms = (pose, body, armR) => {
	switch (pose) {
		case 'armUp':
			return {
				left: { pos: [body.width * -0.5, 0.08, 0], rot: [0.25, 0, 0.45] },
				right: { pos: [body.width * 0.38, 0.55, 0.18], rot: [-1.15, 0, -0.35] },
			};
		case 'handsHips':
			return {
				left: { pos: [body.width * -0.58, -0.12, 0.18], rot: [0.7, 0, 0.65] },
				right: { pos: [body.width * 0.58, -0.12, 0.18], rot: [0.7, 0, -0.65] },
			};
		case 'armsOpen':
			return {
				left: { pos: [body.width * -0.62, 0.2, 0], rot: [0.15, 0, 0.55] },
				right: { pos: [body.width * 0.62, 0.2, 0], rot: [0.15, 0, -0.55] },
			};
		case 'pointing':
			return {
				left: { pos: [body.width * -0.45, 0.05, 0], rot: [0.2, 0, 0.4] },
				right: { pos: [body.width * 0.42, 0.45, 0.2], rot: [-1, 0, -0.25] },
			};
		default:
			// relaxed – arms at sides
			return {
				left: { pos: [body.width * -0.48, 0.05, 0], rot: [0.1, 0, 0.4] },
				right: { pos: [body.width * 0.48, 0.05, 0], rot: [0.1, 0, -0.4] },
			};
	}
};

function FullAvatar({ ethnicity = 'arab', hairstyle = 'medium', bodyType = 'normal', clothingColor = 'blue' }) {
	const groupRef = useRef();
	const config = avatarConfigs[ethnicity] || avatarConfigs.arab;
	const hair = hairstyles[hairstyle] || hairstyles.medium;
	const body = bodyTypes[bodyType] || bodyTypes.normal;
	const torsoTop = body.torsoTop ?? body.width * 0.35;
	const torsoBottom = body.torsoBottom ?? body.width * 0.28;
	const armR = body.armRadius ?? body.width * 0.1;
	const legR = body.legRadius ?? body.width * 0.12;
	const pose = body.pose || 'relaxed';
	const displayScale = body.displayScale ?? 1.2;
	const armPose = poseArms(pose, body, armR);

	useFrame((state, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.4;
		}
	});

	const clothHex = clothingColors[clothingColor] || clothingColors.blue;
	const skinMat = <meshStandardMaterial color={config.skinTone} roughness={0.65} metalness={0.05} />;
	const clothMat = <meshStandardMaterial color={clothHex} roughness={0.7} metalness={0.08} />;
	const hairMat = <meshStandardMaterial color={config.hairColor} roughness={0.85} metalness={0.02} />;

	const armLen = body.height * 0.4;
	const legLen = body.height * 0.35;
	const legY = -0.75;

	return (
		<group ref={groupRef} scale={displayScale}>
			{/* Torso - shape varies by body type */}
			<Cylinder args={[torsoTop, torsoBottom, body.height * 0.5, 24]} position={[0, -0.45, 0]}>
				{clothMat}
			</Cylinder>

			<Cylinder args={[body.width * 0.15, body.width * 0.18, 0.15, 16]} position={[0, 0.05, 0]}>
				{skinMat}
			</Cylinder>

			<Sphere args={[body.width * 0.5, 32, 32]} position={[0, body.height * 0.45, 0]}>
				{skinMat}
			</Sphere>

			<Sphere
				args={[body.width * 0.52 * hair.scale, 32, 16]}
				position={[0, body.height * 0.5 + hair.height * 0.08, 0]}
				scale={[1, hair.scale * 0.9, 1]}
			>
				{hairMat}
			</Sphere>

			<Sphere args={[body.width * 0.1, 16, 16]} position={[body.width * -0.15, body.height * 0.52, body.width * 0.4]}>
				<meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
			</Sphere>
			<Sphere args={[body.width * 0.1, 16, 16]} position={[body.width * 0.15, body.height * 0.52, body.width * 0.4]}>
				<meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
			</Sphere>
			<Sphere args={[body.width * 0.05, 16, 16]} position={[body.width * -0.15, body.height * 0.52, body.width * 0.5]}>
				<meshStandardMaterial color={config.eyeColor} roughness={0.3} metalness={0.1} />
			</Sphere>
			<Sphere args={[body.width * 0.05, 16, 16]} position={[body.width * 0.15, body.height * 0.52, body.width * 0.5]}>
				<meshStandardMaterial color={config.eyeColor} roughness={0.3} metalness={0.1} />
			</Sphere>
			<Cylinder args={[body.width * 0.08, body.width * 0.08, body.width * 0.03, 20, 1, false, 0, Math.PI * 0.6]} position={[0, body.height * 0.38, body.width * 0.42]} rotation={[0, 0, Math.PI]}>
				<meshStandardMaterial color="#8B4545" roughness={0.7} metalness={0} />
			</Cylinder>

			{/* Arms - pose-based positions for different shapes */}
			<Cylinder args={[armR, armR * 0.85, armLen, 16]} position={armPose.left.pos} rotation={armPose.left.rot}>
				{skinMat}
			</Cylinder>
			<Cylinder args={[armR, armR * 0.85, armLen, 16]} position={armPose.right.pos} rotation={armPose.right.rot}>
				{skinMat}
			</Cylinder>

			{/* Legs - spacing varies slightly by body type */}
			<Cylinder args={[legR, legR * 0.88, legLen, 16]} position={[body.width * -0.15, legY, 0]}>
				{clothMat}
			</Cylinder>
			<Cylinder args={[legR, legR * 0.88, legLen, 16]} position={[body.width * 0.15, legY, 0]}>
				{clothMat}
			</Cylinder>
		</group>
	);
}

export function AvatarPreviewCanvas({ ethnicity = 'arab', hairstyle = 'medium', bodyType = 'normal', clothingColor = 'blue' }) {
	return (
		<Canvas
			style={{ width: '100%', height: '100%', minHeight: 280 }}
			camera={{ position: [0, 0.15, 2.4], fov: 42 }}
			gl={{ antialias: true, alpha: true }}
			shadows
		>
			<ambientLight intensity={0.55} />
			<directionalLight position={[3, 4, 5]} intensity={1.1} castShadow />
			<directionalLight position={[-2.5, 2, 3]} intensity={0.35} />
			<directionalLight position={[0, 2, -3]} intensity={0.5} color="#e8f4ff" />
			<pointLight position={[0, 1.5, 1]} intensity={0.25} color="#fff8e7" />
			<ContactShadows position={[0, -0.98, 0]} opacity={0.4} scale={3} blur={1.2} far={1.5} color="#1a1a1a" />
			<FullAvatar
				ethnicity={ethnicity}
				hairstyle={hairstyle}
				bodyType={bodyType}
				clothingColor={clothingColor}
			/>
		</Canvas>
	);
}
