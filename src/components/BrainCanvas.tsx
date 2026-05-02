import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface BrainCanvasProps {
  onRegionClick: (region: string | null) => void;
  activeRegion: string | null;
  opacity: number;
  activePlane: 'Sagittal' | 'Horizontal' | 'Coronal' | null;
  clipPosition: number;
  zoom: number;
}

interface BrainModelProps {
  onRegionClick: (region: string | null) => void;
  activeRegion: string | null;
  opacity: number;
  activePlanes: THREE.Plane[];
}

// Global clipping planes
const sagittalPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
const horizontalPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
const coronalPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

function CameraController({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
    }
  }, [zoom, camera]);
  return null;
}

// --------------------------------------------------------
// 真实 3D 模型加载组件 (Real 3D Model Component)
// --------------------------------------------------------
function RealBrainModel({ onRegionClick, activeRegion, opacity, activePlanes }: BrainModelProps) {
  // 尝试加载 public/brain.glb，如果您上传了该文件，这里就会被激活
  const { scene } = useGLTF('/brain.glb');
  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null);

  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child: any) => {
      if (child.isMesh) {
        // 备份原有的材质以防覆盖
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone();
        }

        const isHoveredOrActive = 
          hoveredMesh === child.name || activeRegion === child.name;

        if (isHoveredOrActive) {
          // 变成金色
          child.material = new THREE.MeshStandardMaterial({
            color: '#C5A059',
            roughness: 0.3,
            metalness: 0.6,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide,
            clippingPlanes: activePlanes
          });
        } else {
          // 恢复基础按黑/灰样式
          child.material = new THREE.MeshStandardMaterial({
            color: '#737373',
            roughness: 0.6,
            metalness: 0.2,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide,
            clippingPlanes: activePlanes
          });
        }
      }
    });
  }, [scene, hoveredMesh, activeRegion, opacity, activePlanes]);

  // 遍历模型的网格，赋予鼠标交互事件和金色高光材质
  return (
    <primitive 
      object={scene} 
      scale={2} // 自定义缩放大小，这取决于下载模型的原始尺寸
      position={[0, 0, 0]}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        if (e.object.name) {
          setHoveredMesh(e.object.name);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        setHoveredMesh(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e: any) => {
        e.stopPropagation();
        if (e.object.name) {
          // 点击某个脑区，告诉父组件
          const newRegion = activeRegion === e.object.name ? null : e.object.name;
          onRegionClick(newRegion);
        }
      }}
    />
  );
}

// --------------------------------------------------------
// 占位模型组件 (Placeholder Brain Component)
// 当没有 brain.glb 文件时渲染
// --------------------------------------------------------
function PlaceholderBrain({ onRegionClick, activeRegion, opacity, activePlanes }: BrainModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const regions = [
    { name: 'Frontal Lobe', position: [0, 0.5, 1], scale: [1.2, 1, 1.5] },
    { name: 'Parietal Lobe', position: [0, 1.2, -0.5], scale: [1.2, 0.8, 1.2] },
    { name: 'Occipital Lobe', position: [0, 0.2, -1.8], scale: [1, 0.8, 0.8] },
    { name: 'Temporal Lobe', position: [1.2, -0.2, 0], scale: [0.6, 0.8, 1.5] },
    { name: 'Temporal Lobe (L)', position: [-1.2, -0.2, 0], scale: [0.6, 0.8, 1.5] },
  ];

  return (
    <group ref={group}>
      {regions.map((region, i) => {
        const isHovered = hovered === region.name;
        const isActiveOrHovered = activeRegion === region.name || isHovered;
        
        return (
          <mesh
            key={i}
            position={new THREE.Vector3(...region.position)}
            scale={new THREE.Vector3(...region.scale)}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(region.name);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRegionClick(isActiveOrHovered ? null : region.name); // Toggle
            }}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color={isActiveOrHovered ? '#C5A059' : '#737373'} 
              transparent={true}
              opacity={isActiveOrHovered ? 1 : opacity}
              roughness={0.6}
              metalness={0.2}
              clippingPlanes={activePlanes}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 带有错误捕获的包裹组件，用于在 missing brain.glb 时平滑降级
function BrainModelWrapper({ onRegionClick, activeRegion, opacity, activePlanes }: BrainModelProps) {
  const [hasModelError, setHasModelError] = useState(false);

  // 一旦加载外部模型出错（比如 404），则退回到 PlaceholderBrain
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (e.reason?.message?.includes('404')) {
        e.preventDefault();
        setHasModelError(true);
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  if (hasModelError) {
    return <PlaceholderBrain onRegionClick={onRegionClick} activeRegion={activeRegion} opacity={opacity} activePlanes={activePlanes} />;
  }

  return (
    <Suspense fallback={<PlaceholderBrain onRegionClick={onRegionClick} activeRegion={activeRegion} opacity={opacity} activePlanes={activePlanes} />}>
      <RealBrainModel onRegionClick={onRegionClick} activeRegion={activeRegion} opacity={opacity} activePlanes={activePlanes} />
    </Suspense>
  );
}

export default function BrainCanvas({ onRegionClick, activeRegion, opacity, activePlane, clipPosition, zoom }: BrainCanvasProps) {
  const activePlanes = useMemo(() => {
    if (activePlane === 'Sagittal') return [sagittalPlane];
    if (activePlane === 'Horizontal') return [horizontalPlane];
    if (activePlane === 'Coronal') return [coronalPlane];
    return [];
  }, [activePlane]);

  useEffect(() => {
    // clipPosition 0->100 maps to offset roughly -2.5 to 2.5
    const offset = (clipPosition / 100) * 5 - 2.5;
    sagittalPlane.constant = offset;
    horizontalPlane.constant = offset;
    coronalPlane.constant = offset;
  }, [clipPosition]);

  return (
    <div className="absolute inset-0">
      <Canvas gl={{ localClippingEnabled: true }} camera={{ position: [5, 2, 5], fov: 45 }}>
        <CameraController zoom={zoom} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <Environment preset="city" />
        
        {/* 当没有上传模型时默认展示占位模型，如果有 brain.glb 则自动渲染！*/}
        <BrainModelWrapper 
          onRegionClick={onRegionClick} 
          activeRegion={activeRegion}
          opacity={opacity}
          activePlanes={activePlanes}
        />
        
        <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={10} blur={2} far={4} color="#000000" />
        <OrbitControls 
          enablePan={true} 
          minDistance={3} 
          maxDistance={10}
          autoRotate={!activeRegion} /* 没有选中脑区时可以缓慢旋转 */
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
