import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { TreeSegment } from './TreeSegment';

const TREE_DATA = [
  { color: '#2d5a27', word: 'Growth' },    // Dark green
  { color: '#3a7a34', word: 'Nature' },    // Forest green
  { color: '#4d8b3d', word: 'Life' },      // Medium green
  { color: '#5c9c46', word: 'Harmony' },   // Light green
  { color: '#6bad4f', word: 'Balance' },   // Bright green
  { color: '#79bd57', word: 'Peace' },     // Vibrant green
  { color: '#88cc60', word: 'Wisdom' },    // Fresh green
];

export function TreeScene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        target={[0, 1, 0]}
      />
      
      <Environment preset="sunset" />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#2d2d2d"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Tree segments */}
      {TREE_DATA.map((data, index) => (
        <TreeSegment
          key={index}
          position={[0, index * 2, 0]}
          leafDirection={index % 2 === 0 ? 'left' : 'right'}
          leafColor={data.color}
          word={data.word}
          isCrown={index === TREE_DATA.length - 1}
        />
      ))}
    </>
  );
}