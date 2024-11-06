import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { TreeScene } from './components/TreeScene';
import { Loader } from '@react-three/drei';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (containerRef.current) {
        containerRef.current.scrollTop += e.deltaY;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen overflow-y-auto bg-black scrollbar-hide"
      style={{
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="h-[200vh]">
        <Canvas
          shadows
          camera={{ position: [0, 1, 6], fov: 60 }}
          className="w-full h-full fixed top-0 left-0"
        >
          <TreeScene />
        </Canvas>
      </div>
      
      <Loader />
      
      <div className="fixed bottom-4 left-4 text-white text-sm bg-black/50 p-2 rounded">
        <p>Scroll to explore the wisdom tree</p>
      </div>
    </div>
  );
}

export default App;