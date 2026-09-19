"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { DIALS, FINISHES } from "@/lib/watchConfig";
import { shade } from "@/lib/color";

/* ---------- material that eases toward its target colour ---------- */
function Metal({ color, roughness, tint = 0 }) {
  const ref = useRef(null);
  const target = useMemo(() => new THREE.Color(tint ? shade(color, tint) : color), [color, tint]);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    m.color.lerp(target, 0.12);
    m.roughness = THREE.MathUtils.lerp(m.roughness, roughness, 0.12);
  });
  return <meshStandardMaterial ref={ref} color={color} metalness={1} roughness={roughness} envMapIntensity={1.4} />;
}

/* ---------- dial texture painted on a canvas (no font/asset downloads) ---------- */
function makeDialTexture(base, ink) {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const mid = size / 2;

  const grad = g.createRadialGradient(mid * 0.8, mid * 0.75, 30, mid, mid, mid);
  grad.addColorStop(0, shade(base, 0.22));
  grad.addColorStop(1, shade(base, -0.28));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  // sunburst
  g.save();
  g.translate(mid, mid);
  g.lineWidth = 2;
  for (let i = 0; i < 240; i++) {
    g.rotate((Math.PI * 2) / 240);
    g.strokeStyle = i % 2 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.06)";
    g.beginPath();
    g.moveTo(60, 0);
    g.lineTo(mid, 0);
    g.stroke();
  }
  g.restore();

  // minute track
  g.save();
  g.translate(mid, mid);
  g.strokeStyle = ink;
  for (let i = 0; i < 60; i++) {
    g.rotate((Math.PI * 2) / 60);
    g.globalAlpha = i % 5 === 0 ? 0.9 : 0.45;
    g.lineWidth = i % 5 === 0 ? 5 : 2;
    g.beginPath();
    g.moveTo(0, -mid * 0.93);
    g.lineTo(0, -mid * (i % 5 === 0 ? 0.87 : 0.9));
    g.stroke();
  }
  g.restore();

  // wordmark
  g.fillStyle = ink;
  g.textAlign = "center";
  g.globalAlpha = 0.95;
  g.font = "500 62px 'Cormorant Garamond', Georgia, serif";
  g.fillText("BOSPHORUS", mid, mid - 170);
  g.globalAlpha = 0.7;
  g.font = "400 30px 'Manrope', system-ui, sans-serif";
  g.fillText("H O R O L O G Y", mid, mid - 122);
  g.font = "italic 400 34px 'Cormorant Garamond', Georgia, serif";
  g.fillText("Automatic, İstanbul", mid, mid + 230);

  // date window
  g.globalAlpha = 1;
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fillRect(mid + 250, mid - 34, 120, 68);
  g.strokeStyle = ink;
  g.globalAlpha = 0.6;
  g.lineWidth = 3;
  g.strokeRect(mid + 250, mid - 34, 120, 68);
  g.globalAlpha = 0.95;
  g.fillStyle = "#f2efe6";
  g.font = "600 44px 'Manrope', system-ui, sans-serif";
  g.fillText(String(new Date().getDate()), mid + 310, mid + 15);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------- the watch ---------- */
function Watch({ finish, dial }) {
  const f = FINISHES[finish];
  const d = DIALS[dial];
  const hour = useRef(null);
  const minute = useRef(null);
  const second = useRef(null);

  const texture = useMemo(() => makeDialTexture(d.base, d.ink), [d.base, d.ink]);
  useEffect(() => () => texture.dispose(), [texture]);

  const indices = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const holes = useMemo(() => [-0.36, -0.18, 0, 0.18, 0.36], []);
  const strapColor = f.strap;
  const handColor = dial === "ivory" ? "#1d1a14" : "#f2e7c9";

  useFrame(() => {
    const now = new Date();
    const ms = now.getMilliseconds() / 1000;
    const s = now.getSeconds() + ms;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2;
  });

  return (
    <group rotation={[-0.08, 0.32, 0]} scale={1.05}>
      {/* case */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.3, 96]} />
        <Metal color={f.color} roughness={f.roughness} />
      </mesh>
      {/* bezel */}
      <mesh position={[0, 0, 0.15]}>
        <torusGeometry args={[0.93, 0.07, 32, 128]} />
        <Metal color={f.color} roughness={f.roughness} tint={0.12} />
      </mesh>
      {/* caseback */}
      <mesh position={[0, 0, -0.152]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.72, 64]} />
        <meshPhysicalMaterial color="#111318" metalness={0.4} roughness={0.15} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0, -0.153]} rotation={[Math.PI, 0, 0]}>
        <ringGeometry args={[0.55, 0.6, 64]} />
        <Metal color={f.color} roughness={f.roughness} />
      </mesh>

      {/* dial */}
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.88, 96]} />
        <meshStandardMaterial map={texture} roughness={0.55} metalness={0.15} />
      </mesh>

      {/* applied indices */}
      {indices.map((i) => {
        const a = (i / 12) * Math.PI * 2;
        const big = i % 3 === 0;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.72, Math.cos(a) * 0.72, 0.135]} rotation={[0, 0, -a]}>
            <boxGeometry args={[big ? 0.075 : 0.045, big ? 0.2 : 0.14, 0.03]} />
            <Metal color={f.color} roughness={0.12} tint={0.1} />
          </mesh>
        );
      })}

      {/* hands */}
      <group ref={hour} position={[0, 0, 0.17]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.075, 0.46, 0.014]} />
          <meshStandardMaterial color={handColor} metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.19]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.052, 0.7, 0.014]} />
          <meshStandardMaterial color={handColor} metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
      <group ref={second} position={[0, 0, 0.21]}>
        <mesh position={[0, 0.27, 0]}>
          <boxGeometry args={[0.014, 0.9, 0.008]} />
          <meshStandardMaterial color="#c9a45c" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <boxGeometry args={[0.03, 0.14, 0.008]} />
          <meshStandardMaterial color="#c9a45c" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.215]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 32]} />
        <Metal color="#c9a45c" roughness={0.2} />
      </mesh>

      {/* crystal */}
      <mesh position={[0, 0, 0.19]}>
        <circleGeometry args={[0.9, 96]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          depthWrite={false}
        />
      </mesh>

      {/* crown */}
      <mesh position={[1.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
        <Metal color={f.color} roughness={f.roughness} />
      </mesh>
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.085, 0.085, 0.05, 32]} />
        <Metal color={f.color} roughness={f.roughness} tint={-0.1} />
      </mesh>

      {/* lugs */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sy) => (
          <mesh key={`${sx}${sy}`} position={[sx * 0.5, sy * 1.02, 0]} rotation={[0, 0, sx * sy * -0.16]}>
            <boxGeometry args={[0.2, 0.42, 0.24]} />
            <Metal color={f.color} roughness={f.roughness} tint={-0.05} />
          </mesh>
        )),
      )}

      {/* strap */}
      <group>
        <RoundedBox
          args={[0.84, 1.6, 0.12]}
          radius={0.05}
          smoothness={4}
          position={[0, 1.78, -0.07]}
          rotation={[0.18, 0, 0]}
        >
          <meshStandardMaterial color={strapColor} roughness={0.68} metalness={0.05} />
        </RoundedBox>
        <RoundedBox
          args={[0.84, 1.8, 0.12]}
          radius={0.05}
          smoothness={4}
          position={[0, -1.88, -0.07]}
          rotation={[-0.18, 0, 0]}
        >
          <meshStandardMaterial color={strapColor} roughness={0.68} metalness={0.05} />
        </RoundedBox>
        {holes.map((y) => (
          <mesh
            key={y}
            position={[0, -2.15 + y * 2.2, -0.005 - Math.abs(y) * 0.02]}
            rotation={[Math.PI / 2 - 0.18, 0, 0]}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
            <meshStandardMaterial color="#050506" roughness={1} />
          </mesh>
        ))}
        {/* buckle */}
        <mesh position={[0, 1.15, 0.02]}>
          <boxGeometry args={[0.9, 0.08, 0.05]} />
          <Metal color={f.color} roughness={f.roughness} />
        </mesh>
      </group>
    </group>
  );
}

export default function WatchViewer3D({ finish, dial, active }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 32 }}
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 5, 6]} angle={0.4} penumbra={1} intensity={90} color="#fff4dc" />
      <pointLight position={[-4, -2, 3]} intensity={12} color="#6fa2ff" />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 4, 4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, -1]} scale={[6, 5, 1]} color="#c9a45c" />
        <Lightformer form="rect" intensity={2} position={[5, 0, 2]} scale={[3, 6, 1]} color="#dfe8ff" />
        <Lightformer form="ring" intensity={2.5} position={[0, -3, 5]} scale={4} color="#ffffff" />
      </Environment>

      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.35}>
        <Watch finish={finish} dial={dial} />
      </Float>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.1}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.65}
        rotateSpeed={0.7}
      />
    </Canvas>
  );
}
