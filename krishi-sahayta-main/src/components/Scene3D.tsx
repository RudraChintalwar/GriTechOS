import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Environment } from "@react-three/drei";
import { Suspense, forwardRef } from "react";
import { Mesh } from "three";

interface FloatingSphereProps {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
}

const FloatingSphere = forwardRef<Mesh, FloatingSphereProps>(
  ({ position, color, size = 1, speed = 1 }, ref) => {
    return (
      <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
        <Sphere ref={ref} args={[size, 64, 64]} position={position}>
          <MeshDistortMaterial
            color={color}
            envMapIntensity={0.4}
            clearcoat={0.8}
            clearcoatRoughness={0}
            metalness={0.1}
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </Sphere>
      </Float>
    );
  }
);

FloatingSphere.displayName = "FloatingSphere";

const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-60">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#22c55e" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#84cc16" />
          
          <FloatingSphere position={[-4, 2, -2]} color="#22c55e" size={1.2} speed={1.5} />
          <FloatingSphere position={[4, -1, -3]} color="#84cc16" size={0.8} speed={2} />
          <FloatingSphere position={[0, 3, -4]} color="#10b981" size={0.6} speed={1} />
          <FloatingSphere position={[-3, -2, -2]} color="#22c55e" size={0.4} speed={2.5} />
          <FloatingSphere position={[3, 1, -1]} color="#84cc16" size={0.5} speed={1.8} />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
