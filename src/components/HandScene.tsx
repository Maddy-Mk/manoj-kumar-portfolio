import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Point = readonly [number, number, number];
type Bone = readonly [number, number];

const BONES: Bone[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
] as const;

const OPEN: Point[] = [
  [0, -1.72, 0.12],
  [-0.48, -1.28, 0.08],
  [-0.84, -0.88, 0.08],
  [-1.14, -0.38, 0.12],
  [-1.34, 0.18, 0.2],
  [-0.5, -1.0, 0],
  [-0.62, -0.2, -0.02],
  [-0.61, 0.58, 0],
  [-0.55, 1.28, 0.06],
  [-0.14, -0.9, -0.04],
  [-0.16, -0.02, -0.08],
  [-0.12, 0.86, -0.04],
  [-0.07, 1.62, 0.04],
  [0.23, -0.95, -0.02],
  [0.34, -0.12, -0.08],
  [0.42, 0.68, -0.03],
  [0.49, 1.34, 0.06],
  [0.58, -1.08, 0.04],
  [0.78, -0.36, 0],
  [0.92, 0.3, 0.08],
  [1.01, 0.88, 0.18],
];

const PINCH: Point[] = OPEN.map((point) => [...point] as Point);
PINCH[2] = [-0.78, -0.74, 0.1];
PINCH[3] = [-0.87, -0.04, 0.26];
PINCH[4] = [-0.68, 0.52, 0.38];
PINCH[6] = [-0.62, -0.18, 0.02];
PINCH[7] = [-0.45, 0.32, 0.24];
PINCH[8] = [-0.64, 0.55, 0.4];
PINCH[11] = [-0.02, 0.54, 0.05];
PINCH[12] = [0.05, 0.96, 0.2];
PINCH[15] = [0.51, 0.42, 0.08];
PINCH[16] = [0.58, 0.76, 0.22];
PINCH[19] = [0.84, 0.12, 0.16];
PINCH[20] = [0.83, 0.42, 0.3];

const POINTING: Point[] = OPEN.map((point) => [...point] as Point);
POINTING[2] = [-0.72, -0.82, 0.12];
POINTING[3] = [-0.55, -0.42, 0.28];
POINTING[4] = [-0.22, -0.05, 0.38];
POINTING[10] = [-0.02, -0.03, 0.06];
POINTING[11] = [0.2, 0.25, 0.3];
POINTING[12] = [0.02, 0.0, 0.48];
POINTING[14] = [0.4, -0.08, 0.04];
POINTING[15] = [0.6, 0.18, 0.28];
POINTING[16] = [0.42, -0.03, 0.45];
POINTING[18] = [0.77, -0.35, 0.08];
POINTING[19] = [0.94, -0.02, 0.28];
POINTING[20] = [0.73, -0.21, 0.46];

const SWIPE: Point[] = OPEN.map(([x, y, z]) => [x + (y + 1.7) * 0.2, y, z]);

const JOINT_COLORS = [
  "#ff5a36",
  "#c8ee4a",
  "#c8ee4a",
  "#c8ee4a",
  "#c8ee4a",
  "#3157d5",
  "#3157d5",
  "#3157d5",
  "#3157d5",
  "#f2f4f1",
  "#f2f4f1",
  "#f2f4f1",
  "#f2f4f1",
  "#ff5a36",
  "#ff5a36",
  "#ff5a36",
  "#ff5a36",
  "#c8ee4a",
  "#c8ee4a",
  "#c8ee4a",
  "#c8ee4a",
];

interface HandSceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

function smoother(value: number): number {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function segmentForProgress(progress: number): {
  from: Point[];
  to: Point[];
  amount: number;
} {
  if (progress < 0.2) {
    return { from: OPEN, to: PINCH, amount: smoother(progress / 0.2) };
  }
  if (progress < 0.42) {
    return {
      from: PINCH,
      to: POINTING,
      amount: smoother((progress - 0.2) / 0.22),
    };
  }
  if (progress < 0.67) {
    return {
      from: POINTING,
      to: SWIPE,
      amount: smoother((progress - 0.42) / 0.25),
    };
  }
  return {
    from: SWIPE,
    to: OPEN,
    amount: smoother((progress - 0.67) / 0.33),
  };
}

function HandRig({ progress, reducedMotion }: HandSceneProps) {
  const group = useRef<THREE.Group>(null);
  const joints = useRef<THREE.InstancedMesh>(null);
  const bones = useRef<THREE.LineSegments>(null);
  const measurements = useRef<THREE.LineSegments>(null);
  const measureMaterial = useRef<THREE.LineBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const points = useMemo(
    () => Array.from({ length: 21 }, () => new THREE.Vector3()),
    [],
  );
  const bonePositions = useMemo(
    () => new Float32Array(BONES.length * 2 * 3),
    [],
  );
  const boneColors = useMemo(() => {
    const values = new Float32Array(BONES.length * 2 * 3);
    BONES.forEach(([start, end], index) => {
      const startColor = new THREE.Color(JOINT_COLORS[start]);
      const endColor = new THREE.Color(JOINT_COLORS[end]);
      startColor.toArray(values, index * 6);
      endColor.toArray(values, index * 6 + 3);
    });
    return values;
  }, []);
  const measurePositions = useMemo(() => new Float32Array(18), []);

  useFrame((state, delta) => {
    if (!group.current || !joints.current || !bones.current) return;

    const scroll = reducedMotion ? 0.03 : progress.get();
    const { from, to, amount } = segmentForProgress(scroll);
    const tiny = state.size.width < 480;
    const compact = state.size.width < 760;
    const tablet = state.size.width < 1020;

    for (let index = 0; index < points.length; index += 1) {
      const start = from[index];
      const end = to[index];
      points[index].set(
        THREE.MathUtils.lerp(start[0], end[0], amount),
        THREE.MathUtils.lerp(start[1], end[1], amount),
        THREE.MathUtils.lerp(start[2], end[2], amount),
      );

      dummy.position.copy(points[index]);
      const scale = index === 0 ? 1.45 : index % 4 === 0 ? 1.18 : 1;
      dummy.scale.setScalar(scale);
      dummy.rotation.set(scroll * 1.2, index * 0.17, scroll * 0.6);
      dummy.updateMatrix();
      joints.current.setMatrixAt(index, dummy.matrix);
    }
    joints.current.instanceMatrix.needsUpdate = true;

    BONES.forEach(([start, end], index) => {
      points[start].toArray(bonePositions, index * 6);
      points[end].toArray(bonePositions, index * 6 + 3);
    });
    const boneAttribute = bones.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    boneAttribute.needsUpdate = true;

    const measurePairs: Bone[] = [
      [0, 9],
      [5, 17],
      [4, 8],
    ];
    measurePairs.forEach(([start, end], index) => {
      points[start].toArray(measurePositions, index * 6);
      points[end].toArray(measurePositions, index * 6 + 3);
    });
    if (measurements.current) {
      const measureAttribute = measurements.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      measureAttribute.needsUpdate = true;
    }
    if (measureMaterial.current) {
      const normalizationWindow = 1 - Math.min(Math.abs(scroll - 0.28) * 7, 1);
      measureMaterial.current.opacity = 0.12 + normalizationWindow * 0.78;
    }

    const targetX = tiny ? 1.02 : compact ? 1.16 : tablet ? 1.28 : 1.35;
    const targetY = tiny ? 1.48 : compact ? 1.02 : tablet ? 0.42 : -0.05;
    const targetScale = tiny ? 0.58 : compact ? 0.7 : tablet ? 0.86 : 1.12;
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetX + (reducedMotion ? 0 : state.pointer.x * 0.12),
      4,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY + (reducedMotion ? 0 : state.pointer.y * 0.08),
      4,
      delta,
    );
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, targetScale, 4, delta),
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (compact ? -0.2 : -0.34) + (reducedMotion ? 0 : state.pointer.x * 0.1),
      4,
      delta,
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      scroll > 0.42 && scroll < 0.68 ? -0.16 : 0.08,
      3,
      delta,
    );

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      reducedMotion ? 0 : state.pointer.x * 0.08,
      3,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      reducedMotion ? 0 : state.pointer.y * 0.06,
      3,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={joints} args={[undefined, undefined, 21]}>
        <icosahedronGeometry args={[0.082, 0]} />
        <meshBasicMaterial color="#f2f4f1" />
      </instancedMesh>

      <lineSegments ref={bones}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bonePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[boneColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.82} />
      </lineSegments>

      <lineSegments ref={measurements}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[measurePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={measureMaterial}
          color="#c8ee4a"
          transparent
          opacity={0.12}
        />
      </lineSegments>

      <group position={[1.72, 0.1, -0.45]} rotation={[0, -0.25, 0]}>
        {[-0.72, 0, 0.72].map((y, index) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshBasicMaterial
              color={["#ff5a36", "#3157d5", "#c8ee4a"][index]}
              wireframe
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function HandScene({ progress, reducedMotion }: HandSceneProps) {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.6], fov: 42, near: 0.1, far: 40 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        fallback={
          <div className="scene-fallback">
            <span>21-point interaction rig</span>
          </div>
        }
      >
        <ambientLight intensity={1.55} />
        <directionalLight position={[4, 4, 5]} intensity={2.4} />
        <directionalLight position={[-3, -2, 3]} intensity={0.8} color="#3157d5" />
        <HandRig progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
