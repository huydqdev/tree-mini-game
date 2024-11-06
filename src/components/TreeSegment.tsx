import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';

interface TreeSegmentProps {
  position: [number, number, number];
  leafDirection: 'left' | 'right';
  leafColor: string;
  word: string;
  isCrown?: boolean;
}

export function TreeSegment({ position, leafDirection, leafColor, word, isCrown }: TreeSegmentProps) {
  const groupRef = useRef<Group>(null);
  const leafOffset = leafDirection === 'left' ? -1.5 : 1.5;
  
  const leafGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.ellipse(0, 0, 0.8, 0.4, 0, Math.PI * 2);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    });
  }, []);

  const vineGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.2, -0.3, 0.1),
      new THREE.Vector3(-0.2, -0.6, -0.1),
      new THREE.Vector3(0.1, -0.9, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      const leaf = groupRef.current.children[1];
      leaf.rotation.z = Math.sin(state.clock.elapsedTime + position[1]) * 0.1;
      if (isCrown) {
        leaf.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[1]) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Log segment */}
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
        <meshStandardMaterial
          color="#4a3728"
          roughness={0.8}
          metalness={0.2}
          normalScale={new THREE.Vector2(1, 1)}
        />
      </mesh>

      {/* Leaf group */}
      <group position={[leafOffset, 0.5, 0]} rotation={[0, 0, leafDirection === 'left' ? 0.3 : -0.3]}>
        <mesh castShadow geometry={leafGeometry}>
          <meshStandardMaterial
            color={leafColor}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        
        {/* Word on leaf */}
        <Text
          position={[0, 0, 0.6]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {word}
        </Text>

        {/* Leaf vein */}
        <mesh position={[0, 0, 0.026]}>
          <boxGeometry args={[1.2, 0.05, 0.01]} />
          <meshStandardMaterial
            color={new THREE.Color(leafColor).multiplyScalar(0.7)}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Crown extras */}
      {isCrown && (
        <>
          {/* Additional leaves */}
          {[-1, 0, 1].map((x) => (
            <group key={x} position={[x * 0.8, 1, x * 0.3]} rotation={[0.2, x * 0.3, x * 0.2]}>
              <mesh castShadow geometry={leafGeometry} scale={0.6}>
                <meshStandardMaterial color={leafColor} roughness={0.7} metalness={0.1} />
              </mesh>
            </group>
          ))}
          
          {/* Vines */}
          {[-0.6, 0.6].map((x) => (
            <mesh key={x} position={[x, 0.8, 0]} geometry={vineGeometry}>
              <meshStandardMaterial color="#2d5a27" roughness={1} metalness={0} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}