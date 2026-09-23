import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stage } from "@react-three/drei";

// 1. Separate model component into its own boundary
function CowModel() {
  const { scene } = useGLTF("/cow.glb");
  return <primitive object={scene} />;
}

// Preload asset outside render cycle
useGLTF.preload("/cow.glb");

export default function Model() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        // 2. Cap pixel ratio to 1.5 or 2 to stop 4K/retina GPU choking
        dpr={[1, 1.5]}
        // 3. Render on demand instead of running 60-120fps constantly
        frameloop="demand"
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <Suspense fallback={null}>
          {/* 4. Stage handles its own lighting and shadows; remove extra lights */}
          <Stage environment="city" intensity={0.5} shadows={false}>
            <CowModel />
          </Stage>
        </Suspense>

        {/* <OrbitControls enableZoom={true} makeDefault /> */}
        <OrbitControls
          makeDefault
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.05}
          zoomSpeed={0.25}
          minDistance={2.2}
          maxDistance={7.8}
        />
      </Canvas>
    </div>
  );
}
