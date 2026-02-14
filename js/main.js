// ============================================
// 3D Dynamic Developer Portfolio — Main Script
// ============================================

import * as THREE from 'three';
import { skills, projects } from './data.js';

// ============================================
// Constants
// ============================================
const SECTION_COUNT = 5;
const SECTION_NAMES = ['Home', 'About', 'Skills', 'Projects', 'Contact'];
const CAMERA_POSITIONS = [
    { x: 0, y: 0, z: 5 },
    { x: 0, y: 0.5, z: -10 },
    { x: 0, y: 0, z: -35 },
    { x: 0, y: 0, z: -55 },
    { x: 0, y: 0, z: -75 },
];
const LERP_SPEED = 0.04;

// ============================================
// State
// ============================================
let currentSection = 0;
let targetSection = 0;
let isTransitioning = false;
let scrollCooldown = false;
let reducedMotion = false;
let mouseX = 0;
let mouseY = 0;
let clock = new THREE.Clock();
let modalOpen = false;

// ============================================
// Device Capability Detection
// ============================================
function getDeviceQuality() {
    const cores = navigator.hardwareConcurrency || 2;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile || cores <= 2) return 'low';
    if (cores <= 4) return 'medium';
    return 'high';
}

const quality = getDeviceQuality();
const particleCount = quality === 'high' ? 2000 : quality === 'medium' ? 1000 : 400;
const dpr = quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2);

// ============================================
// Three.js Setup
// ============================================
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality !== 'low',
    alpha: true,
    powerPreference: quality === 'low' ? 'low-power' : 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(dpr);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0f, 0.008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(CAMERA_POSITIONS[0].x, CAMERA_POSITIONS[0].y, CAMERA_POSITIONS[0].z);

// ============================================
// Lighting
// ============================================
const ambientLight = new THREE.AmbientLight(0x222244, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.PointLight(0x6c63ff, 2, 80);
mainLight.position.set(5, 5, 8);
scene.add(mainLight);

const secondaryLight = new THREE.PointLight(0x8b83ff, 1.2, 60);
secondaryLight.position.set(-5, 3, -10);
scene.add(secondaryLight);

const accentLight = new THREE.PointLight(0x4ade80, 0.6, 50);
accentLight.position.set(3, -2, -35);
scene.add(accentLight);

const projectLight = new THREE.PointLight(0x6c63ff, 1.5, 60);
projectLight.position.set(0, 3, -55);
scene.add(projectLight);

const contactLight = new THREE.PointLight(0x8b83ff, 1, 50);
contactLight.position.set(0, 2, -75);
scene.add(contactLight);

// Solar system light (Sun glow)
const sunLight = new THREE.PointLight(0xffdd44, 3, 60);
sunLight.position.set(0, 0, -12);
scene.add(sunLight);

// ============================================
// Materials
// ============================================
const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x6c63ff,
    emissive: 0x6c63ff,
    emissiveIntensity: 0.15,
    metalness: 0.7,
    roughness: 0.3,
});

const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x6c63ff,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8b83ff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.5,
    transparent: true,
    opacity: 0.5,
});

// ============================================
// Hero Section — Milky Way Galaxy
// ============================================
const heroGroup = new THREE.Group();
heroGroup.position.set(0, 0, 0);

// Galaxy Configuration
const GALAXY = {
    arms: 4,                // Number of spiral arms
    armSpread: 0.35,        // How wide each arm spreads
    armCurve: 2.8,          // How tightly arms curve (higher = tighter)
    armParticles: quality === 'high' ? 12000 : quality === 'medium' ? 7000 : 3500,
    bulgeParticles: quality === 'high' ? 4000 : quality === 'medium' ? 2500 : 1200,
    hazeParticles: quality === 'high' ? 3000 : quality === 'medium' ? 1500 : 800,
    radius: 4.5,            // Overall galaxy radius
    bulgeRadius: 1.0,       // Central bulge radius
    thickness: 0.15,        // Disk thickness
    bulgeThickness: 0.6,    // Bulge vertical spread
};

// --- Central Bulge (dense warm core) ---
(function createBulge() {
    const count = GALAXY.bulgeParticles;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Spherical distribution concentrated at center
        const r = Math.pow(Math.random(), 1.5) * GALAXY.bulgeRadius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        // Flatten slightly to make it oblate
        const flatFactor = 0.6;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.cos(phi) * flatFactor;
        positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

        // Warm colors: white center -> warm yellow -> orange at edges
        const t = r / GALAXY.bulgeRadius;
        const color = new THREE.Color();
        color.setHSL(
            0.12 - t * 0.06,  // Hue: warm yellow to orange
            0.3 + t * 0.3,     // Saturation increases outward
            0.95 - t * 0.35    // Luminance: bright center -> dimmer
        );
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = (1.0 - t * 0.5) * (0.8 + Math.random() * 0.6);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    heroGroup.add(new THREE.Points(geo, mat));
})();

// --- Spiral Arms ---
(function createSpiralArms() {
    const count = GALAXY.armParticles;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Pick a random arm
        const armIndex = Math.floor(Math.random() * GALAXY.arms);
        const armAngleOffset = (armIndex / GALAXY.arms) * Math.PI * 2;

        // Distance from center (biased toward inner regions)
        const dist = GALAXY.bulgeRadius * 0.5 + Math.pow(Math.random(), 0.7) * (GALAXY.radius - GALAXY.bulgeRadius * 0.5);

        // Logarithmic spiral angle
        const spiralAngle = dist * GALAXY.armCurve + armAngleOffset;

        // Spread perpendicular to arm (gaussian-ish)
        const spread = (Math.random() - 0.5 + (Math.random() - 0.5)) * GALAXY.armSpread * (0.5 + dist / GALAXY.radius);

        const x = Math.cos(spiralAngle + spread) * dist;
        const z = Math.sin(spiralAngle + spread) * dist;
        // Thin disk with slight random vertical offset
        const y = (Math.random() - 0.5) * GALAXY.thickness * (1 + dist * 0.3);

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Color gradient: inner warm -> outer cool blue
        const t = dist / GALAXY.radius;
        const color = new THREE.Color();

        if (t < 0.3) {
            // Inner: warm white-yellow
            color.setHSL(0.12, 0.2 + t, 0.85 - t * 0.3);
        } else if (t < 0.6) {
            // Mid: transition to blue-white
            const blend = (t - 0.3) / 0.3;
            color.setHSL(0.12 + blend * 0.5, 0.3, 0.7 - blend * 0.1);
        } else {
            // Outer: cool blue
            color.setHSL(0.6 + Math.random() * 0.05, 0.4 + Math.random() * 0.2, 0.5 + Math.random() * 0.2);
        }

        // Add some reddish nebula spots randomly
        if (Math.random() < 0.05 && t > 0.2) {
            color.setHSL(0.95 + Math.random() * 0.1, 0.6, 0.4 + Math.random() * 0.2);
        }

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = (0.3 + Math.random() * 0.7) * (1.0 - t * 0.4);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    heroGroup.add(new THREE.Points(geo, mat));
})();

// --- Disk Haze (diffuse glow between arms) ---
(function createDiskHaze() {
    const count = GALAXY.hazeParticles;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const dist = Math.pow(Math.random(), 0.5) * GALAXY.radius;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * GALAXY.thickness * 2;

        positions[i3] = Math.cos(angle) * dist;
        positions[i3 + 1] = y;
        positions[i3 + 2] = Math.sin(angle) * dist;

        const t = dist / GALAXY.radius;
        const color = new THREE.Color();
        color.setHSL(0.65, 0.15, 0.25 + t * 0.1);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    heroGroup.add(new THREE.Points(geo, mat));
})();

// --- Bright core glow (simple mesh) ---
(function createCoreGlow() {
    const glowGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xfff4e0,
        transparent: true,
        opacity: 0.6,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    heroGroup.add(glow);

    // Larger soft outer glow
    const outerGlowGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const outerGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffe8c0,
        transparent: true,
        opacity: 0.15,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
    heroGroup.add(outerGlow);
})();

// Tilt galaxy to show it at an angle (like viewing Milky Way from outside)
heroGroup.rotation.x = 0.8;  // ~45 degree tilt
heroGroup.rotation.z = 0.2;

scene.add(heroGroup);

// ============================================
// About Section — Solar System
// ============================================
const solarSystemGroup = new THREE.Group();
solarSystemGroup.position.set(0, 0, -12);

// --- Sun ---
const sunGeo = new THREE.SphereGeometry(0.8, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({
    color: 0xffcc33,
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
solarSystemGroup.add(sunMesh);

// Sun inner glow
const sunGlowGeo = new THREE.SphereGeometry(1.0, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
solarSystemGroup.add(sunGlow);

// Sun outer glow
const sunOuterGlowGeo = new THREE.SphereGeometry(1.6, 32, 32);
const sunOuterGlowMat = new THREE.MeshBasicMaterial({
    color: 0xff8800,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});
const sunOuterGlow = new THREE.Mesh(sunOuterGlowGeo, sunOuterGlowMat);
solarSystemGroup.add(sunOuterGlow);

// --- Planet Data ---
// Each planet: { name, radius, size, color, emissive, speed, zOffset, hasRing }
const planetData = [
    { name: 'Mercury', orbitRadius: 1.8, size: 0.08, color: 0xaaaaaa, emissive: 0x444444, speed: 1.6, zOffset: 0 },
    { name: 'Venus', orbitRadius: 2.5, size: 0.14, color: 0xe8a840, emissive: 0x804020, speed: 1.2, zOffset: -0.5 },
    { name: 'Earth', orbitRadius: 3.3, size: 0.15, color: 0x3388ff, emissive: 0x112266, speed: 1.0, zOffset: -1.0 },
    { name: 'Mars', orbitRadius: 4.2, size: 0.11, color: 0xcc4422, emissive: 0x661100, speed: 0.8, zOffset: -1.5 },
    { name: 'Jupiter', orbitRadius: 5.8, size: 0.4, color: 0xd4a56a, emissive: 0x553311, speed: 0.45, zOffset: -3.0 },
    { name: 'Saturn', orbitRadius: 7.2, size: 0.35, color: 0xe8d088, emissive: 0x665522, speed: 0.35, zOffset: -5.0, hasRing: true },
    { name: 'Uranus', orbitRadius: 9.0, size: 0.22, color: 0x66ccdd, emissive: 0x224455, speed: 0.25, zOffset: -7.5 },
    { name: 'Neptune', orbitRadius: 10.5, size: 0.2, color: 0x3344cc, emissive: 0x111155, speed: 0.18, zOffset: -10.0 },
];

const planets = [];

planetData.forEach((data, index) => {
    // Planet pivot (for orbiting)
    const pivot = new THREE.Group();
    pivot.position.z = data.zOffset;
    // Random starting angle
    pivot.rotation.y = Math.random() * Math.PI * 2;

    // Planet mesh
    const planetGeo = new THREE.SphereGeometry(data.size, 24, 24);
    const planetMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.emissive,
        emissiveIntensity: 0.4,
        metalness: 0.3,
        roughness: 0.6,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.position.x = data.orbitRadius;

    // Planet glow
    const glowGeo = new THREE.SphereGeometry(data.size * 1.5, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    planetMesh.add(glowMesh);

    // Saturn ring
    if (data.hasRing) {
        const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xccbb88,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.5;
        planetMesh.add(ringMesh);
    }

    pivot.add(planetMesh);
    solarSystemGroup.add(pivot);

    planets.push({
        pivot,
        mesh: planetMesh,
        speed: data.speed,
        orbitRadius: data.orbitRadius,
        name: data.name,
    });

    // Orbit trail ring
    const trailGeo = new THREE.RingGeometry(data.orbitRadius - 0.02, data.orbitRadius + 0.02, 128);
    const trailMat = new THREE.MeshBasicMaterial({
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.rotation.x = Math.PI / 2;
    trail.position.z = data.zOffset;
    solarSystemGroup.add(trail);
});

// --- Asteroid Belt (between Mars and Jupiter) ---
const asteroidCount = quality === 'high' ? 600 : quality === 'medium' ? 300 : 150;
const asteroidPositions = new Float32Array(asteroidCount * 3);
const asteroidColors = new Float32Array(asteroidCount * 3);

for (let i = 0; i < asteroidCount; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 4.8 + Math.random() * 1.2;
    const y = (Math.random() - 0.5) * 0.5;
    const z = -2.0 + (Math.random() - 0.5) * 1.5;

    asteroidPositions[i3] = Math.cos(angle) * radius;
    asteroidPositions[i3 + 1] = y;
    asteroidPositions[i3 + 2] = z;

    const brightness = 0.3 + Math.random() * 0.4;
    asteroidColors[i3] = brightness;
    asteroidColors[i3 + 1] = brightness * 0.9;
    asteroidColors[i3 + 2] = brightness * 0.7;
}

const asteroidGeo = new THREE.BufferGeometry();
asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
asteroidGeo.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));

const asteroidMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});

const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
solarSystemGroup.add(asteroidBelt);

scene.add(solarSystemGroup);

// ============================================
// Skills Section — Floating Orbs
// ============================================
const skillsGroup = new THREE.Group();
skillsGroup.position.set(0, 0, -35);

const allSkills = [
    ...skills.frontend.map(s => ({ ...s, category: 'frontend' })),
    ...skills.backend.map(s => ({ ...s, category: 'backend' })),
    ...skills.tools.map(s => ({ ...s, category: 'tools' })),
];

const categoryColors = {
    frontend: 0x6c63ff,
    backend: 0x4ade80,
    tools: 0xfbbf24,
};

const skillOrbs = [];
const orbCount = Math.min(allSkills.length, quality === 'low' ? 8 : 18);

for (let i = 0; i < orbCount; i++) {
    const skill = allSkills[i % allSkills.length];
    const angle = (i / orbCount) * Math.PI * 2;
    const radius = 2.5 + Math.random() * 1.5;
    const y = (Math.random() - 0.5) * 2.5;

    const orbGeometry = new THREE.SphereGeometry(0.12 + Math.random() * 0.1, 16, 16);
    const orbMaterial = new THREE.MeshStandardMaterial({
        color: categoryColors[skill.category],
        emissive: categoryColors[skill.category],
        emissiveIntensity: 0.5,
        metalness: 0.5,
        roughness: 0.3,
    });

    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
    );
    orb.userData = { basePos: orb.position.clone(), speed: 0.3 + Math.random() * 0.5, offset: Math.random() * Math.PI * 2 };
    skillOrbs.push(orb);
    skillsGroup.add(orb);
}

// Central dodecahedron
const dodecGeometry = new THREE.DodecahedronGeometry(0.6, 0);
const dodecMesh = new THREE.Mesh(dodecGeometry, accentMaterial.clone());
skillsGroup.add(dodecMesh);

const dodecWire = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.8, 0),
    wireframeMaterial
);
skillsGroup.add(dodecWire);

scene.add(skillsGroup);

// ============================================
// Projects Section — 3D Floating Planes
// ============================================
const projectsGroup = new THREE.Group();
projectsGroup.position.set(0, 0, -55);

const projectMeshes = [];
projects.forEach((project, i) => {
    const cardGroup = new THREE.Group();
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = (col - 1) * 2.8;
    const y = -row * 2.2 + 0.5;

    // Card plane
    const planeGeometry = new THREE.BoxGeometry(2, 1.5, 0.05);
    const planeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a2e,
        emissive: 0x6c63ff,
        emissiveIntensity: 0.04,
        metalness: 0.3,
        roughness: 0.5,
        transparent: true,
        opacity: 0.8,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    cardGroup.add(planeMesh);

    // Top edge glow
    const edgeGeometry = new THREE.BoxGeometry(2, 0.03, 0.06);
    const edgeMaterial = new THREE.MeshBasicMaterial({
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.6,
    });
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.position.y = 0.75;
    cardGroup.add(edge);

    cardGroup.position.set(x, y, 0);
    cardGroup.userData = {
        projectIndex: i,
        basePos: new THREE.Vector3(x, y, 0),
        baseRotation: new THREE.Euler(0, 0, 0),
    };

    projectMeshes.push(cardGroup);
    projectsGroup.add(cardGroup);
});

scene.add(projectsGroup);

// ============================================
// Contact Section — Particles Grid
// ============================================
const contactGroup = new THREE.Group();
contactGroup.position.set(0, 0, -75);

const gridSize = quality === 'low' ? 6 : 10;
const gridSpacing = 0.8;
for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
    for (let y = -gridSize / 2; y <= gridSize / 2; y++) {
        const dotGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: 0x6c63ff,
            transparent: true,
            opacity: 0.2 + Math.random() * 0.2,
        });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.set(x * gridSpacing, y * gridSpacing, -1 + Math.random() * 0.5);
        contactGroup.add(dot);
    }
}

scene.add(contactGroup);

// ============================================
// Background Particles
// ============================================
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 50;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 25;
    particlePositions[i3 + 2] = 10 - Math.random() * 100;
    particleSizes[i] = Math.random() * 2 + 0.5;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
});


const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// ============================================
// Raycaster for Project Clicking
// ============================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// ============================================
// UI Population
// ============================================

// Skills
function populateSkills() {
    const categories = { frontend: 'frontend-skills', backend: 'backend-skills', tools: 'tools-skills' };
    for (const [category, elementId] of Object.entries(categories)) {
        const container = document.getElementById(elementId);
        if (!container) continue;
        skills[category].forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `${skill.name}<span class="tooltip">${skill.level}</span>`;
            container.appendChild(tag);
        });
    }
}

// Projects
function populateProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    projects.forEach((project, i) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-index', i);
        card.innerHTML = `
      <h3>${project.title}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-stack">
        ${project.stack.map(s => `<span class="stack-badge">${s}</span>`).join('')}
      </div>
      <span class="card-arrow">↗</span>
    `;
        card.addEventListener('click', () => openModal(i));
        grid.appendChild(card);
    });
}

// Modal
function openModal(index) {
    const project = projects[index];
    if (!project) return;
    modalOpen = true;

    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-description').textContent = project.description;

    const stackContainer = document.getElementById('modal-stack');
    stackContainer.innerHTML = project.stack.map(s => `<span class="stack-badge">${s}</span>`).join('');

    const githubLink = document.getElementById('modal-github');
    const liveLink = document.getElementById('modal-live');

    githubLink.href = project.githubUrl;
    if (project.liveUrl) {
        liveLink.href = project.liveUrl;
        liveLink.style.display = 'inline-flex';
    } else {
        liveLink.style.display = 'none';
    }

    const modal = document.getElementById('project-modal');
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    modalOpen = false;
    const modal = document.getElementById('project-modal');
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
}

// ============================================
// Section Navigation
// ============================================

function goToSection(index) {
    if (index < 0 || index >= SECTION_COUNT || index === currentSection || isTransitioning) return;
    isTransitioning = true;
    targetSection = index;

    // Update UI
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.indicator').forEach(i => i.classList.remove('active'));
    document.querySelectorAll(`.nav-link[data-section="${index}"]`).forEach(l => l.classList.add('active'));
    document.querySelectorAll(`.indicator[data-section="${index}"]`).forEach(i => i.classList.add('active'));

    // Overlay transition
    document.querySelectorAll('.overlay-section').forEach(s => s.classList.remove('active'));
    const overlayIds = ['hero-overlay', 'about-overlay', 'skills-overlay', 'projects-overlay', 'contact-overlay'];

    setTimeout(() => {
        const overlay = document.getElementById(overlayIds[index]);
        if (overlay) overlay.classList.add('active');
    }, 400);

    // Scroll indicator visibility
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = index === 0 ? '1' : '0';
    }

    currentSection = index;

    setTimeout(() => {
        isTransitioning = false;
    }, 1200);
}

// ============================================
// Scroll Handling
// ============================================

function onWheel(e) {
    if (scrollCooldown || modalOpen) return;

    const delta = Math.sign(e.deltaY);
    const next = currentSection + delta;

    if (next >= 0 && next < SECTION_COUNT) {
        goToSection(next);
        scrollCooldown = true;
        setTimeout(() => { scrollCooldown = false; }, 1000);
    }
}

// Touch handling
let touchStartY = 0;
function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function onTouchEnd(e) {
    if (modalOpen) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) {
        const delta = diff > 0 ? 1 : -1;
        const next = currentSection + delta;
        if (next >= 0 && next < SECTION_COUNT && !scrollCooldown) {
            goToSection(next);
            scrollCooldown = true;
            setTimeout(() => { scrollCooldown = false; }, 1000);
        }
    }
}

// Keyboard
function onKeyDown(e) {
    if (modalOpen) {
        if (e.key === 'Escape') closeModal();
        return;
    }

    switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            goToSection(currentSection + 1);
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            goToSection(currentSection - 1);
            break;
        case 'Home':
            e.preventDefault();
            goToSection(0);
            break;
        case 'End':
            e.preventDefault();
            goToSection(SECTION_COUNT - 1);
            break;
        case '1': case '2': case '3': case '4': case '5':
            goToSection(parseInt(e.key) - 1);
            break;
    }
}

// Mouse tracking
function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    pointer.x = mouseX;
    pointer.y = mouseY;
}

// ============================================
// Click Handling for 3D Project Cards
// ============================================
function onClick(e) {
    if (currentSection !== 3 || modalOpen) return;

    raycaster.setFromCamera(pointer, camera);
    const meshes = projectMeshes.map(g => g.children[0]);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        const group = hit.parent;
        if (group && group.userData.projectIndex !== undefined) {
            openModal(group.userData.projectIndex);
        }
    }
}

// ============================================
// Animation Loop
// ============================================
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    if (reducedMotion) {
        // Just lerp camera, skip 3D animations
        const target = CAMERA_POSITIONS[currentSection];
        camera.position.x += (target.x - camera.position.x) * LERP_SPEED * 2;
        camera.position.y += (target.y - camera.position.y) * LERP_SPEED * 2;
        camera.position.z += (target.z - camera.position.z) * LERP_SPEED * 2;
        renderer.render(scene, camera);
        return;
    }

    // Camera lerp with mouse parallax
    const target = CAMERA_POSITIONS[currentSection];
    const parallaxX = mouseX * 0.3;
    const parallaxY = mouseY * 0.15;

    camera.position.x += (target.x + parallaxX - camera.position.x) * LERP_SPEED;
    camera.position.y += (target.y + parallaxY - camera.position.y) * LERP_SPEED;
    camera.position.z += (target.z - camera.position.z) * LERP_SPEED;

    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.3, camera.position.z - 10);

    // Galaxy rotation — slow, continuous spin on Y axis
    heroGroup.rotation.y = elapsed * 0.03;

    // Solar system animation — planet orbits
    planets.forEach((planet) => {
        planet.pivot.rotation.y += planet.speed * delta * 0.3;
    });

    // Sun pulsation
    const sunScale = 1.0 + Math.sin(elapsed * 1.5) * 0.04;
    sunMesh.scale.setScalar(sunScale);
    sunGlow.scale.setScalar(sunScale * 1.05);
    sunOuterGlow.scale.setScalar(1.0 + Math.sin(elapsed * 0.8) * 0.06);
    sunLight.intensity = 3 + Math.sin(elapsed * 1.2) * 0.5;

    // Asteroid belt slow rotation
    asteroidBelt.rotation.y = elapsed * 0.02;

    // Skills orbs floating
    skillOrbs.forEach((orb, i) => {
        const { basePos, speed, offset } = orb.userData;
        orb.position.x = basePos.x + Math.sin(elapsed * speed + offset) * 0.3;
        orb.position.y = basePos.y + Math.cos(elapsed * speed * 0.7 + offset) * 0.2;
        orb.position.z = basePos.z + Math.sin(elapsed * speed * 0.5 + offset * 2) * 0.2;
    });

    dodecMesh.rotation.x = elapsed * 0.2;
    dodecMesh.rotation.y = elapsed * 0.15;
    dodecWire.rotation.x = -elapsed * 0.1;
    dodecWire.rotation.y = -elapsed * 0.12;

    // Project cards subtle hover
    projectMeshes.forEach((group, i) => {
        const { basePos } = group.userData;
        group.position.y = basePos.y + Math.sin(elapsed * 0.5 + i * 0.8) * 0.08;
        group.rotation.y = Math.sin(elapsed * 0.3 + i) * 0.03;
    });

    // Contact grid pulse
    contactGroup.children.forEach((dot, i) => {
        dot.material.opacity = 0.15 + Math.sin(elapsed * 0.5 + i * 0.1) * 0.1;
    });

    // Particle drift
    const particlePos = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePos[i3 + 1] += Math.sin(elapsed * 0.2 + i) * 0.001;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Dynamic light positions
    mainLight.position.x = Math.sin(elapsed * 0.3) * 5;
    mainLight.position.y = Math.cos(elapsed * 0.2) * 3 + 3;
    secondaryLight.position.x = Math.cos(elapsed * 0.4) * 4 - 3;

    renderer.render(scene, camera);
}

// ============================================
// Event Listeners
// ============================================
window.addEventListener('wheel', onWheel, { passive: true });
window.addEventListener('keydown', onKeyDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);
window.addEventListener('touchstart', onTouchStart, { passive: true });
window.addEventListener('touchend', onTouchEnd, { passive: true });

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Nav clicks
document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        goToSection(parseInt(link.dataset.section));
    });
});

// Indicator clicks
document.querySelectorAll('.indicator[data-section]').forEach(dot => {
    dot.addEventListener('click', () => {
        goToSection(parseInt(dot.dataset.section));
    });
});

// CTA buttons
document.querySelectorAll('.btn[data-section]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSection(parseInt(btn.dataset.section));
    });
});

// Modal close
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// Reduced motion toggle
const motionToggle = document.getElementById('reduced-motion-toggle');
motionToggle.addEventListener('click', () => {
    reducedMotion = !reducedMotion;
    document.body.classList.toggle('reduced-motion', reducedMotion);
    motionToggle.classList.toggle('active', reducedMotion);
});

// Check system preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reducedMotion = true;
    document.body.classList.add('reduced-motion');
    motionToggle.classList.add('active');
}

// ============================================
// Initialize
// ============================================
function init() {
    populateSkills();
    populateProjects();

    // Hide loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
    }, 1500);

    // Start animation loop
    animate();
}

init();
