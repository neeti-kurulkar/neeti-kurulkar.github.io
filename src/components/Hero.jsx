import React, { useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LaptopModel } from './Laptop';

const AnimatedLaptopScene = ({ animationComplete, onAnimationComplete }) => {
  const laptopRef = useRef();
  const { camera } = useThree();
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  useFrame(() => {
    if (!isAnimationDone) {
      // Define final positions and rotations
      const finalCameraPosition = new THREE.Vector3(0, 0, 15);
      const finalLaptopPosition = new THREE.Vector3(0, -1, 0);
      const finalLaptopRotation = new THREE.Vector3(0, -Math.PI / 8, 0); // Rotate to 22.5 degrees

      // Smoothly zoom the camera in
      camera.position.lerp(finalCameraPosition, 0.05);

      // Smoothly move the laptop down and rotate it
      if (laptopRef.current) {
        laptopRef.current.position.lerp(finalLaptopPosition, 0.05);
        laptopRef.current.rotation.y = THREE.MathUtils.lerp(laptopRef.current.rotation.y, finalLaptopRotation.y, 0.05);
      }

      // Check if both animations are complete
      if (camera.position.distanceTo(finalCameraPosition) < 0.1 && 
          laptopRef.current.position.distanceTo(finalLaptopPosition) < 0.1 &&
          Math.abs(laptopRef.current.rotation.y - finalLaptopRotation.y) < 0.01) {
        setIsAnimationDone(true);
        onAnimationComplete(true);
      }
    }
  });

  return <LaptopModel ref={laptopRef} position={[0, -1, 25]} />; // Initial far position for laptop
};

const Hero = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <section className="pt-42 pb-16 px-4 sm:px-6 lg:px-8 bg-[#040D12]">
      <div className="max-w-7xl mx-auto">
        <div className="font-[Open_Sans] grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#D5F0E5]/85 leading-tight mb-6">
              Student Developer exploring Generative AI and Automation.
            </h1>
            <p className="text-xl text-[#D5F0E5]/65 mb-8 leading-relaxed">
              Currently a Final Year Computer Engineering student passionate about building impactful solutions using AI.
            </p>
            <div className="flex space-x-4">
              <a
                href="#work"
                className="bg-[#5C8374] text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                View Work
              </a>
              <a
                href="#contact"
                className="border border-gray-600 text-gray-300 px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
          <div className="hidden lg:block w-full h-full aspect-square md:aspect-auto">
            <Canvas camera={{ position: [0, 0, 25], fov: 40 }}>
              <pointLight position={[10, 10, 10]} intensity={1} />
              <ambientLight intensity={0.5} />
              <AnimatedLaptopScene animationComplete={animationComplete} onAnimationComplete={setAnimationComplete} />
              <OrbitControls enabled={animationComplete} />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;