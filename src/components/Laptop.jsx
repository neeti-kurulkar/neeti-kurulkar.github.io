import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function LaptopModel(props) {
  const { nodes, materials } = useGLTF('/mac-draco.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0.002, -0.038, 0.414]} rotation={[0.014, 0, 0]}>
        <group position={[0, 2.965, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube008.geometry}
            material={materials.aluminium}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube008_1.geometry}
            material={materials['matte.001']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube008_2.geometry}
            material={materials['screen.001']}
          />
        </group>
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.keyboard.geometry}
        material={materials.keys}
        position={[1.793, 0, 3.451]}
      />
      <group position={[0, -0.1, 3.394]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002.geometry}
          material={materials.aluminium}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002_1.geometry}
          material={materials.trackpad}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.touchbar.geometry}
        material={materials.touchbar}
        position={[0, -0.027, 1.201]}
      />
    </group>
  )
}

useGLTF.preload('/mac-draco.glb')