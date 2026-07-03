import * as THREE from "https://esm.sh/three@0.164.1";

/* ===================================================
   DOM References
   =================================================== */
const canvas = document.querySelector("#scene");
const appShell = document.querySelector("#app-shell");
const overlay = document.querySelector("#path-overlay");
const websiteLayer = document.querySelector("#website-layer");
const assetHandle = document.querySelector("#asset-handle");
const viewportShell = document.querySelector(".viewport-shell");
const orientationGizmo = document.querySelector(".orientation-gizmo-container");
const sectionList = document.querySelector("#section-list");
const layerList = document.querySelector("#layer-list");
const sectionNameInput = document.querySelector("#section-name");
const sectionTitleLabel = document.querySelector("#section-title-label");
const canvasSectionName = document.querySelector("#canvas-section-name");
const viewportStatus = document.querySelector("#viewport-status");
const togglePanelsButton = document.querySelector("#toggle-panels");
const addSectionButton = document.querySelector("#add-section");
const addTextButton = document.querySelector("#add-text");
const playButton = document.querySelector("#play-preview");
const clearPathButton = document.querySelector("#clear-path");
const allSectionsToggle = document.querySelector("#all-sections-toggle");
const resetButton = document.querySelector("#reset-demo");
const copyCodeButton = document.querySelector("#copy-code");
const copyAgainButton = document.querySelector("#copy-again");
const closeCodeButton = document.querySelector("#close-code");
const codeModal = document.querySelector("#code-modal");
const generatedCode = document.querySelector("#generated-code");
const copyStatus = document.querySelector("#copy-status");
const depthInput = document.querySelector("#path-depth");
const scaleInput = document.querySelector("#scale");
const cameraZInput = document.querySelector("#camera-z");
const pointList = document.querySelector("#point-list");
const pointLabel = document.querySelector("#point-label");
const pointXInput = document.querySelector("#point-x");
const pointYInput = document.querySelector("#point-y");
const pointZInput = document.querySelector("#point-z");
const pointYawInput = document.querySelector("#point-yaw");
const pointPitchInput = document.querySelector("#point-pitch");
const pointRollInput = document.querySelector("#point-roll");
const assetGrid = document.querySelector("#asset-grid");
const assetSearchInput = document.querySelector("#asset-search");

// New UI elements (Phase 1-5)
const undoBtn = document.querySelector("#undo-btn");
const redoBtn = document.querySelector("#redo-btn");
const zoomInBtn = document.querySelector("#zoom-in");
const zoomOutBtn = document.querySelector("#zoom-out");
const zoomResetBtn = document.querySelector("#zoom-reset");
const zoomLevelBadge = document.querySelector("#zoom-level");
const inspectorZoomCopy = document.querySelector("#inspector-zoom-copy");
const stageFrame = document.querySelector("#stage-frame");
const stageWrap = document.querySelector("#stage-wrap");
const stagePages = document.querySelector("#stage-pages");
const sectionPagesBefore = document.querySelector("#section-pages-before");
const sectionPagesAfter = document.querySelector("#section-pages-after");
const scrubber = document.querySelector("#scrubber");
const timeDisplay = document.querySelector("#time-display");
const timelineBar = document.querySelector("#timeline-bar");
const timelinePlayBtn = document.querySelector("#timeline-play");
const loopToggle = document.querySelector("#loop-toggle");
const easingSelect = document.querySelector("#easing");
const durationInput = document.querySelector("#duration");
const sectionBgInput = document.querySelector("#section-bg");
const sectionBgHex = document.querySelector("#section-bg-hex");
const textFormatPanel = document.querySelector("#text-format-panel");
const textKindSelect = document.querySelector("#text-kind");
const textSizeInput = document.querySelector("#text-size");
const textColorInput = document.querySelector("#text-color");
const textColorHex = document.querySelector("#text-color-hex");
const contextMenu = document.querySelector("#context-menu");
const contextMenuBody = contextMenu.querySelector(".context-menu-body");
const shortcutsModal = document.querySelector("#shortcuts-modal");
const closeShortcutsBtn = document.querySelector("#close-shortcuts");
const downloadHtmlBtn = document.querySelector("#download-html");
const toastContainer = document.querySelector("#toast-container");
const loadingSkeleton = document.querySelector("#loading-skeleton");

// Phase 6 UI Elements
const toggleGridBtn = document.querySelector("#toggle-grid");
const layoutGridOverlay = document.querySelector("#layout-grid-overlay");
const gizmoCanvas = document.querySelector("#gizmo-canvas");
const bezierEditorPanel = document.querySelector("#bezier-editor-panel");
const bezierCanvas = document.querySelector("#bezier-canvas");
const bezierX1 = document.querySelector("#bezier-x1");
const bezierY1 = document.querySelector("#bezier-y1");
const bezierX2 = document.querySelector("#bezier-x2");
const bezierY2 = document.querySelector("#bezier-y2");
const exportFormatSelector = document.querySelector("#export-format-selector");

/* ===================================================
   Utilities
   =================================================== */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ===================================================
   Toast Notification System
   =================================================== */
function showToast(message, durationMs = 2500) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.setProperty("--toast-duration", `${durationMs}ms`);
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), durationMs + 400);
}

/* ===================================================
   Cubic Bezier Math Evaluator (Newton-Raphson)
   =================================================== */
function solveCubicBezier(x1, y1, x2, y2) {
  return function(x) {
    if (x === 0 || x === 1) return x;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const currentX = 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) - x;
      if (Math.abs(currentX) < 0.001) break;
      const derivativeX = 3 * Math.pow(1 - t, 2) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * Math.pow(t, 2) * (1 - x2);
      if (Math.abs(derivativeX) < 1e-6) break;
      t -= currentX / derivativeX;
    }
    return 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3);
  };
}

/* ===================================================
   Easing Functions
   =================================================== */
const easingFunctions = {
  linear: (t) => t,
  easeIn: (t) => t * t * t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

function getEasing(section) {
  if (section.easing === "custom" && section.customBezier) {
    const cb = section.customBezier;
    return solveCubicBezier(cb[0], cb[1], cb[2], cb[3]);
  }
  return easingFunctions[section.easing] || easingFunctions.easeInOut;
}

/* ===================================================
   Undo / Redo System
   =================================================== */
class CommandHistory {
  constructor(maxSize = 50) {
    this.stack = [];
    this.pointer = -1;
    this.maxSize = maxSize;
  }

  push(snapshot) {
    this.stack = this.stack.slice(0, this.pointer + 1);
    this.stack.push(deepClone(snapshot));
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    } else {
      this.pointer++;
    }
    this.syncButtons();
  }

  undo() {
    if (this.pointer <= 0) return null;
    this.pointer--;
    this.syncButtons();
    return deepClone(this.stack[this.pointer]);
  }

  redo() {
    if (this.pointer >= this.stack.length - 1) return null;
    this.pointer++;
    this.syncButtons();
    return deepClone(this.stack[this.pointer]);
  }

  canUndo() {
    return this.pointer > 0;
  }

  canRedo() {
    return this.pointer < this.stack.length - 1;
  }

  syncButtons() {
    undoBtn.disabled = !this.canUndo();
    redoBtn.disabled = !this.canRedo();
  }
}

const history = new CommandHistory();

function saveSnapshot() {
  history.push(state.sections);
}

function performUndo() {
  const snapshot = history.undo();
  if (!snapshot) return;
  state.sections = snapshot;
  state.currentSectionIndex = clamp(state.currentSectionIndex, 0, state.sections.length - 1);
  fullRefresh();
  showToast("Undo");
}

function performRedo() {
  const snapshot = history.redo();
  if (!snapshot) return;
  state.sections = snapshot;
  state.currentSectionIndex = clamp(state.currentSectionIndex, 0, state.sections.length - 1);
  fullRefresh();
  showToast("Redo");
}

/* ===================================================
   Model Factories
   =================================================== */
let idSeed = 1;

const createText = (text, x, y, size, kind = "headline", color = null) => ({
  id: `text-${idSeed++}`,
  kind,
  text,
  x,
  y,
  size,
  color: color || (kind === "body" ? "#4b5563" : "#111827"),
  visible: true,
});

const createPathPoint = (x, y, yaw = 0, pitch = 0, roll = 0, z = 0) => ({
  x,
  y,
  z,
  yaw,
  pitch,
  roll,
});

const normalizePathPoint = (point) =>
  createPathPoint(
    point.x,
    point.y,
    point.yaw ?? 0,
    point.pitch ?? 0,
    point.roll ?? 0,
    point.z ?? 0,
  );

const createSection = (
  name,
  pathPoints,
  texts,
  bgColor = "#ffffff",
  easing = "easeInOut",
  duration = 3200,
  customBezier = [0.25, 0.25, 0.75, 0.75]
) => ({
  id: `section-${idSeed++}`,
  name,
  modelPoint: normalizePathPoint(pathPoints[0] ?? createPathPoint(0.55, 0.52)),
  pathPoints: pathPoints.map(normalizePathPoint),
  texts,
  bgColor,
  easing,
  duration,
  customBezier,
  visible: true,
});

function createDefaultSections() {
  idSeed = 1;
  return [createSection("Untitled", [], [], "#ffffff")];
}

const assetCatalog = [
  { id: "rocket", name: "Rocket", category: "Motion", colors: ["#ff7d7d", "#f0b54d"] },
  { id: "cube", name: "Cube", category: "Basics", colors: ["#31c48d", "#6aa8ff"] },
  { id: "orb", name: "Orb", category: "Basics", colors: ["#ffffff", "#8f7cff"] },
  { id: "ring", name: "Ring", category: "Abstract", colors: ["#f0b54d", "#f7d58b"] },
  { id: "cone", name: "Cone", category: "Basics", colors: ["#ff6b6b", "#f4b860"] },
  { id: "pyramid", name: "Pyramid", category: "Basics", colors: ["#6aa8ff", "#31c48d"] },
  { id: "cylinder", name: "Cylinder", category: "Basics", colors: ["#9fb3c8", "#e8edf5"] },
  { id: "capsule", name: "Capsule", category: "UI", colors: ["#f4f7fb", "#31c48d"] },
  { id: "torus", name: "Torus", category: "Abstract", colors: ["#ff9f6e", "#ffe0a3"] },
  { id: "knot", name: "Knot", category: "Abstract", colors: ["#8f7cff", "#31c48d"] },
  { id: "prism", name: "Prism", category: "Basics", colors: ["#4fd1c5", "#6aa8ff"] },
  { id: "diamond", name: "Diamond", category: "Icons", colors: ["#d8e8ff", "#6aa8ff"] },
  { id: "coin", name: "Coin", category: "Commerce", colors: ["#f0b54d", "#fff0b7"] },
  { id: "card", name: "Card", category: "UI", colors: ["#f6f8fc", "#9ca6b7"] },
  { id: "panel", name: "Panel", category: "UI", colors: ["#11151b", "#6aa8ff"] },
  { id: "button", name: "Button", category: "UI", colors: ["#31c48d", "#dffbf3"] },
  { id: "spark", name: "Spark", category: "Icons", colors: ["#f0b54d", "#ff6b6b"] },
  { id: "pin", name: "Pin", category: "Icons", colors: ["#ff6b6b", "#f4f7fb"] },
  { id: "cursor", name: "Cursor", category: "Icons", colors: ["#f4f7fb", "#11151b"] },
  { id: "play", name: "Play", category: "Icons", colors: ["#31c48d", "#6aa8ff"] },
  { id: "helix", name: "Helix", category: "Motion", colors: ["#31c48d", "#8f7cff"] },
  { id: "wave", name: "Wave", category: "Motion", colors: ["#6aa8ff", "#f4f7fb"] },
  { id: "stack", name: "Stack", category: "UI", colors: ["#f4f7fb", "#31c48d"] },
  { id: "badge", name: "Badge", category: "Commerce", colors: ["#f0b54d", "#31c48d"] },
];

/* ===================================================
   State
   =================================================== */
const state = {
  asset: "rocket",
  assetPlaced: false,
  light: "studio",
  activeTool: "move",
  isPlaying: false,
  playStartedAt: 0,
  progress: 0,
  currentSectionIndex: 0,
  animateAllSections: false,
  pathDepth: 0,
  scale: 1,
  cameraZ: 6.2,
  selectedPointIndex: 0,
  selectedTextId: null,
  drag: null,
  sections: createDefaultSections(),
  // Zoom & pan
  zoom: 1,
  panX: 0,
  panY: 0,
  isPanning: false,
  // Loop
  loopPlayback: false,
  // Figma Grid Snap active state
  gridActive: false,
  // Custom Bezier drag states
  draggingBezierHandle: 0, // 0 = none, 1 = P1, 2 = P2
  exportFormat: "vanilla",
  cameraDirection: new THREE.Vector3(0, 0, 1),
  isCameraTransitioning: false,
  draggedSectionIndex: null,
};

/* ===================================================
   Three.js Setup (Main Viewport)
   =================================================== */
const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0.8, state.cameraZ);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const drawingPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(18, 12),
  new THREE.MeshBasicMaterial({ visible: false }),
);
drawingPlane.position.z = state.pathDepth;
scene.add(drawingPlane);

const ambient = new THREE.AmbientLight("#ffffff", 0.72);
const keyLight = new THREE.DirectionalLight("#ffffff", 2.4);
const rimLight = new THREE.PointLight("#31c48d", 4.2, 16);
keyLight.position.set(3.5, 4, 5);
rimLight.position.set(-3, 1.4, 3);
scene.add(ambient, keyLight, rimLight);

const grid = new THREE.GridHelper(10, 10, "#303847", "#202734");
grid.rotation.x = Math.PI / 2;
grid.position.z = -1.45;
grid.position.y = -1.8;
scene.add(grid);

const pathLine = new THREE.Line(
  new THREE.BufferGeometry(),
  new THREE.LineBasicMaterial({ color: "#31c48d" }),
);
scene.add(pathLine);

let assetMesh = createAsset(state.asset);
scene.add(assetMesh);

function createAsset(type) {
  const group = new THREE.Group();
  const material = (color, options = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.18, ...options });

  if (type === "rocket") {
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.28, 1.1, 12, 28),
      new THREE.MeshStandardMaterial({ color: "#f4f7fb", metalness: 0.22, roughness: 0.34 }),
    );
    body.rotation.z = Math.PI / 2;

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.58, 32),
      new THREE.MeshStandardMaterial({ color: "#ff7d7d", metalness: 0.08, roughness: 0.42 }),
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 0.84;

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.52, 24),
      new THREE.MeshStandardMaterial({
        color: "#f0b54d",
        emissive: "#ff7d2f",
        emissiveIntensity: 0.8,
        roughness: 0.5,
      }),
    );
    flame.rotation.z = Math.PI / 2;
    flame.position.x = -0.84;

    const finMaterial = new THREE.MeshStandardMaterial({ color: "#31c48d", roughness: 0.4 });
    const finA = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.32), finMaterial);
    const finB = finA.clone();
    finA.position.set(-0.35, -0.28, 0);
    finB.position.set(-0.35, 0.28, 0);
    group.add(body, nose, flame, finA, finB);
  }

  if (type === "cube") {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.15, 1.15),
      new THREE.MeshStandardMaterial({ color: "#31c48d", metalness: 0.18, roughness: 0.28 }),
    );
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(cube.geometry),
      new THREE.LineBasicMaterial({ color: "#dffbf3" }),
    );
    group.add(cube, wire);
  }

  if (type === "orb") {
    group.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 42, 42),
        new THREE.MeshStandardMaterial({
          color: "#8f7cff",
          metalness: 0.35,
          roughness: 0.18,
          emissive: "#211842",
        }),
      ),
    );
  }

  if (type === "ring") {
    group.add(
      new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.52, 0.16, 96, 18),
        new THREE.MeshStandardMaterial({ color: "#f0b54d", metalness: 0.28, roughness: 0.26 }),
      ),
    );
  }

  if (type === "cone") {
    group.add(new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.25, 36), material("#ff7d7d")));
  }

  if (type === "pyramid") {
    group.add(new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.25, 4), material("#6aa8ff")));
  }

  if (type === "cylinder") {
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.2, 40), material("#c8d3df")));
  }

  if (type === "capsule") {
    const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.82, 14, 32), material("#f4f7fb"));
    capsule.rotation.z = Math.PI / 2;
    group.add(capsule);
  }

  if (type === "torus") {
    group.add(new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.18, 28, 80), material("#ff9f6e")));
  }

  if (type === "knot") {
    group.add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.12, 120, 16), material("#8f7cff", { metalness: 0.32 })));
  }

  if (type === "prism") {
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.1, 3), material("#4fd1c5")));
  }

  if (type === "diamond") {
    const top = new THREE.Mesh(new THREE.ConeGeometry(0.56, 0.68, 4), material("#d8e8ff", { metalness: 0.38 }));
    const bottom = top.clone();
    top.position.y = 0.32;
    bottom.position.y = -0.32;
    bottom.rotation.x = Math.PI;
    group.add(top, bottom);
  }

  if (type === "coin" || type === "badge") {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.16, 56), material("#f0b54d", { metalness: 0.45 }));
    coin.rotation.x = Math.PI / 2;
    const mark = new THREE.Mesh(
      type === "badge" ? new THREE.TorusGeometry(0.36, 0.04, 12, 40) : new THREE.CylinderGeometry(0.34, 0.34, 0.18, 40),
      material(type === "badge" ? "#31c48d" : "#fff0b7", { metalness: 0.2 }),
    );
    mark.rotation.x = Math.PI / 2;
    mark.position.z = 0.03;
    group.add(coin, mark);
  }

  if (type === "card" || type === "panel" || type === "button") {
    const width = type === "button" ? 1.28 : 1.35;
    const height = type === "button" ? 0.44 : 0.86;
    const depth = type === "panel" ? 0.1 : 0.08;
    const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(type === "panel" ? "#11151b" : "#f6f8fc"));
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(width * 0.68, 0.08, depth + 0.02), material(type === "button" ? "#31c48d" : "#6aa8ff"));
    stripe.position.y = type === "button" ? 0 : 0.2;
    stripe.position.z = 0.06;
    group.add(base, stripe);
  }

  if (type === "spark") {
    for (let i = 0; i < 6; i++) {
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.64, 12), material(i % 2 ? "#ff6b6b" : "#f0b54d"));
      ray.position.set(Math.cos((i / 6) * Math.PI * 2) * 0.32, Math.sin((i / 6) * Math.PI * 2) * 0.32, 0);
      ray.rotation.z = (i / 6) * Math.PI * 2 - Math.PI / 2;
      group.add(ray);
    }
  }

  if (type === "pin") {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32), material("#ff6b6b"));
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.72, 32), material("#ff6b6b"));
    head.position.y = 0.28;
    point.position.y = -0.34;
    point.rotation.x = Math.PI;
    group.add(head, point);
  }

  if (type === "cursor" || type === "play") {
    const shape = new THREE.Shape();
    if (type === "cursor") {
      shape.moveTo(-0.36, 0.56);
      shape.lineTo(0.46, -0.12);
      shape.lineTo(0.1, -0.18);
      shape.lineTo(0.28, -0.56);
      shape.lineTo(0.02, -0.66);
      shape.lineTo(-0.16, -0.28);
    } else {
      shape.moveTo(-0.42, 0.54);
      shape.lineTo(0.54, 0);
      shape.lineTo(-0.42, -0.54);
    }
    shape.closePath();
    group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025 }), material(type === "cursor" ? "#f4f7fb" : "#31c48d")));
  }

  if (type === "helix" || type === "wave") {
    const colorA = type === "helix" ? "#31c48d" : "#6aa8ff";
    for (let i = 0; i < 10; i++) {
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 18), material(colorA));
      const t = i / 9;
      bead.position.set((t - 0.5) * 1.5, Math.sin(t * Math.PI * 3) * 0.36, type === "helix" ? Math.cos(t * Math.PI * 3) * 0.26 : 0);
      group.add(bead);
    }
  }

  if (type === "stack") {
    for (let i = 0; i < 3; i++) {
      const layer = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 0.72), material(i === 1 ? "#31c48d" : "#f4f7fb"));
      layer.position.y = (i - 1) * 0.26;
      layer.position.z = (i - 1) * 0.08;
      group.add(layer);
    }
  }

  return group;
}

/* ===================================================
   Spline-Style Viewport Orientation Gizmo Setup
   =================================================== */
const gizmoScene = new THREE.Scene();
const gizmoCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
gizmoCamera.position.set(0, 0, 3.5);

const gizmoRenderer = new THREE.WebGLRenderer({ canvas: gizmoCanvas, alpha: true, antialias: true });
gizmoRenderer.setSize(52, 52);

const createGizmoAxis = (dir, color) => {
  const points = [new THREE.Vector3(0, 0, 0), dir.clone().multiplyScalar(0.9)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2.5 });
  const line = new THREE.Line(geometry, material);

  // Axis Tip Sphere
  const tipGeo = new THREE.SphereGeometry(0.14, 8, 8);
  const tipMat = new THREE.MeshBasicMaterial({ color: color });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.copy(points[1]);

  const axisGroup = new THREE.Group();
  axisGroup.add(line, tip);
  return axisGroup;
};

// X = Red, Y = Green, Z = Blue
const gizmoX = createGizmoAxis(new THREE.Vector3(1, 0, 0), "#ff6b6b");
const gizmoY = createGizmoAxis(new THREE.Vector3(0, 1, 0), "#31c48d");
const gizmoZ = createGizmoAxis(new THREE.Vector3(0, 0, 1), "#6aa8ff");
gizmoScene.add(gizmoX, gizmoY, gizmoZ);

// Orbit/Orientation alignment transition
function animateCameraTo(targetPos, targetDir) {
  state.isCameraTransitioning = true;
  const start = camera.position.clone();
  const startTime = performance.now();
  const duration = 350;

  function updateCam(now) {
    const elapsed = now - startTime;
    const progress = clamp(elapsed / duration, 0, 1);
    const ease = easingFunctions.easeInOut(progress);
    camera.position.lerpVectors(start, targetPos, ease);
    camera.lookAt(0, 0.8, 0);
    updateSceneFromState();
    if (progress < 1) {
      requestAnimationFrame(updateCam);
    } else {
      state.cameraDirection.copy(targetDir);
      state.isCameraTransitioning = false;
      state.cameraZ = camera.position.distanceTo(new THREE.Vector3(0, 0.8, 0));
      cameraZInput.value = state.cameraZ.toFixed(1);
    }
  }
  requestAnimationFrame(updateCam);
}

// Axis Snapping interaction
gizmoCanvas.addEventListener("click", (e) => {
  const rect = gizmoCanvas.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1
  );

  console.log("Gizmo Clicked:", { clientX: e.clientX, clientY: e.clientY, rect, mouse });

  const localRaycaster = new THREE.Raycaster();
  localRaycaster.setFromCamera(mouse, gizmoCamera);
  const intersects = localRaycaster.intersectObjects(gizmoScene.children, true);

  console.log("Intersects:", intersects);

  if (intersects.length > 0) {
    const clickedObj = intersects[0].object;
    const color = clickedObj.material.color.getHexString();
    console.log("Clicked object color:", color);
    saveSnapshot();

    if (color === "ff6b6b") { // X Axis -> Snap view right side
      animateCameraTo(new THREE.Vector3(state.cameraZ, 0.8, 0), new THREE.Vector3(1, 0, 0));
      showToast("Snapped to Right View");
    } else if (color === "31c48d") { // Y Axis -> Snap view top side
      animateCameraTo(new THREE.Vector3(0, state.cameraZ + 0.8, 0.001), new THREE.Vector3(0, 1, 0));
      showToast("Snapped to Top View");
    } else if (color === "6aa8ff") { // Z Axis -> Snap view front side
      animateCameraTo(new THREE.Vector3(0, 0.8, state.cameraZ), new THREE.Vector3(0, 0, 1));
      showToast("Snapped to Front View");
    }
  }
});

/* ===================================================
   Figma-Style Drag-To-Snap Grid Computation
   =================================================== */
function calculateGridSnapping(targetX) {
  if (!state.gridActive) return targetX;

  const rect = websiteLayer.getBoundingClientRect();
  const totalWidth = rect.width;
  if (totalWidth <= 0) return targetX;

  const margin = 40; // px margin on sides
  const colCount = 12;
  const gap = 16; // px gutter gap
  const usableWidth = totalWidth - (margin * 2);
  const colWidth = (usableWidth - (gap * (colCount - 1))) / colCount;

  const snapThreshold = 12 / totalWidth; // snap threshold in % width (approx 12px)

  for (let i = 0; i < colCount; i++) {
    const colLeft = (margin + i * (colWidth + gap)) / totalWidth;
    if (Math.abs(targetX - colLeft) < snapThreshold) {
      return colLeft;
    }
    const colRight = colLeft + (colWidth / totalWidth);
    if (Math.abs(targetX - colRight) < snapThreshold) {
      return colRight;
    }
  }
  return targetX;
}

/* ===================================================
   Section & State Helpers
   =================================================== */
function currentSection() {
  return state.sections[state.currentSectionIndex];
}

function placeAssetOnCanvas() {
  const section = currentSection();
  if (section.pathPoints.length === 0) {
    const point = createPathPoint(0.5, 0.5, 0, 0, 0, state.pathDepth);
    section.pathPoints.push(point);
    section.modelPoint = point;
    state.selectedPointIndex = 0;
    state.progress = 0;
    renderSectionList();
    renderSectionPages();
    syncPointInspector();
    updatePathLine();
    drawSvgPath();
  }
  state.assetPlaced = true;
}

function setAsset(type, options = {}) {
  state.asset = type;
  scene.remove(assetMesh);
  assetMesh.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
  });
  assetMesh = createAsset(type);
  scene.add(assetMesh);
  if (options.place) {
    placeAssetOnCanvas();
  }
  updateSceneFromState();
}

function renderAssetLibrary() {
  const query = assetSearchInput.value.trim().toLowerCase();
  const matches = assetCatalog.filter((asset) => {
    const haystack = `${asset.name} ${asset.category} ${asset.id}`.toLowerCase();
    return haystack.includes(query);
  });

  assetGrid.innerHTML = matches
    .map(
      (asset) => `
        <button class="asset-button ${asset.id === state.asset && state.assetPlaced ? "active" : ""}" data-asset="${asset.id}" type="button" title="Place ${escapeHtml(asset.name)} on canvas">
          <span class="asset-swatch" style="--swatch-a:${asset.colors[0]}; --swatch-b:${asset.colors[1]};"></span>
          <span class="asset-meta">
            <strong>${escapeHtml(asset.name)}</strong>
            <em>${escapeHtml(asset.category)}</em>
          </span>
        </button>
      `,
    )
    .join("");

  assetGrid.querySelectorAll(".asset-button").forEach((button) => {
    button.addEventListener("click", () => {
      saveSnapshot();
      setAsset(button.dataset.asset, { place: true });
      renderAssetLibrary();
      showToast(`${button.querySelector("strong").textContent} added`);
    });
  });
}

function setLighting(type) {
  state.light = type;
  if (type === "studio") {
    ambient.intensity = 0.72;
    keyLight.color.set("#ffffff");
    keyLight.intensity = 2.4;
    rimLight.color.set("#31c48d");
    rimLight.intensity = 4.2;
  }
  if (type === "soft") {
    ambient.intensity = 1.08;
    keyLight.color.set("#ffe7bf");
    keyLight.intensity = 1.55;
    rimLight.color.set("#6aa8ff");
    rimLight.intensity = 2.2;
  }
  if (type === "neon") {
    ambient.intensity = 0.46;
    keyLight.color.set("#ff7d7d");
    keyLight.intensity = 2.8;
    rimLight.color.set("#31c48d");
    rimLight.intensity = 7.5;
  }
}

/* ===================================================
   Coordinate Transforms
   =================================================== */
function resize() {
  const rect = viewportShell.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  overlay.setAttribute("viewBox", `0 0 ${width} ${height}`);
  overlay.setAttribute("width", width);
  overlay.setAttribute("height", height);
  updatePathLine();
  drawSvgPath();
  renderWebsiteLayer();
  updateSceneFromState();
}

function normalizedToPixels(point) {
  const rect = overlay.getBoundingClientRect();
  return { x: point.x * rect.width, y: point.y * rect.height };
}

function pixelsToNormalized(point) {
  const rect = overlay.getBoundingClientRect();
  return {
    x: clamp(point.x / rect.width, 0, 1),
    y: clamp(point.y / rect.height, 0, 1),
  };
}

function clientToNormalized(clientX, clientY) {
  const rect = overlay.getBoundingClientRect();
  return pixelsToNormalized({
    x: clientX - rect.left,
    y: clientY - rect.top,
  });
}

function screenToWorld(point, z = state.pathDepth) {
  const rect = overlay.getBoundingClientRect();
  pointer.x = (point.x / rect.width) * 2 - 1;
  pointer.y = -(point.y / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const distance = (z - raycaster.ray.origin.z) / raycaster.ray.direction.z;
  if (!Number.isFinite(distance)) return new THREE.Vector3();
  return raycaster.ray.at(distance, new THREE.Vector3());
}

function normalizedToWorld(point) {
  return screenToWorld(normalizedToPixels(point), point.z ?? state.pathDepth);
}

function worldToScreen(point) {
  const rect = overlay.getBoundingClientRect();
  const projected = point.clone().project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * rect.width,
    y: (-projected.y * 0.5 + 0.5) * rect.height,
  };
}

/* ===================================================
   Path / Curve Computation
   =================================================== */
function worldPointsForSection(section) {
  const points = section.pathPoints.length ? section.pathPoints : [section.modelPoint];
  return points.map(normalizedToWorld);
}

function exportPointsForSection(section) {
  const points = section.pathPoints.length ? section.pathPoints : [section.modelPoint];
  const worldPoints = points.map(normalizedToWorld);
  return points.map((point, index) => ({
    position: [
      Number(worldPoints[index].x.toFixed(3)),
      Number(worldPoints[index].y.toFixed(3)),
      Number(worldPoints[index].z.toFixed(3)),
    ],
    yaw: Math.round(point.yaw ?? 0),
    pitch: Math.round(point.pitch ?? 0),
    roll: Math.round(point.roll ?? 0),
  }));
}

function getCurveForSection(section) {
  const points = worldPointsForSection(section);
  if (points.length === 0) return null;
  if (points.length === 1) {
    return {
      getPoint: () => points[0].clone(),
      getPoints: () => points,
    };
  }
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
}

function pointForSection(section, progress) {
  const curve = getCurveForSection(section);
  if (!curve) return normalizedToWorld(section.modelPoint);
  return curve.getPoint(clamp(progress, 0, 1));
}

function facingForSection(section, progress) {
  const points = section.pathPoints.length ? section.pathPoints : [section.modelPoint];
  if (points.length === 0) return { yaw: 0, pitch: 0, roll: 0 };
  if (points.length === 1) {
    return {
      yaw: points[0].yaw ?? 0,
      pitch: points[0].pitch ?? 0,
      roll: points[0].roll ?? 0,
    };
  }

  const scaled = clamp(progress, 0, 1) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const from = points[index];
  const to = points[index + 1];
  return {
    yaw: lerp(from.yaw ?? 0, to.yaw ?? 0, local),
    pitch: lerp(from.pitch ?? 0, to.pitch ?? 0, local),
    roll: lerp(from.roll ?? 0, to.roll ?? 0, local),
  };
}

function selectedPathPoint() {
  const section = currentSection();
  if (section.pathPoints.length === 0) return null;
  state.selectedPointIndex = clamp(state.selectedPointIndex, 0, section.pathPoints.length - 1);
  return section.pathPoints[state.selectedPointIndex];
}

function pointToAxisX(point) {
  return Math.round((point.x - 0.5) * 200);
}

function pointToAxisY(point) {
  return Math.round((0.5 - point.y) * 200);
}

function axisXToPoint(value) {
  return clamp(0.5 + Number(value) / 200, 0, 1);
}

function axisYToPoint(value) {
  return clamp(0.5 - Number(value) / 200, 0, 1);
}

function setProgressToSelectedPoint() {
  const section = currentSection();
  state.progress =
    section.pathPoints.length <= 1 ? 0 : state.selectedPointIndex / (section.pathPoints.length - 1);
}

/* ===================================================
   Scene Updates
   =================================================== */
function updatePathLine() {
  const section = currentSection();
  const curve = getCurveForSection(section);
  if (!curve || section.pathPoints.length < 2) {
    pathLine.geometry.setFromPoints([]);
    return;
  }
  pathLine.geometry.dispose();
  pathLine.geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
}

let idleTime = 0;

function updateSceneFromState(now = 0) {
  drawingPlane.position.z = state.pathDepth;
  if (!state.isCameraTransitioning) {
    camera.position.copy(state.cameraDirection).multiplyScalar(state.cameraZ);
    camera.position.y += 0.8;
    camera.lookAt(0, 0.8, 0);
  }
  camera.updateProjectionMatrix();

  const section = currentSection();

  // Apply section background color
  const bg = section.bgColor || "#ffffff";
  if (bg.toLowerCase() === "#ffffff") {
    viewportShell.style.background = "#ffffff";
  } else {
    viewportShell.style.background = `
      radial-gradient(circle at 68% 24%, ${bg === "#11151b" ? "rgba(49, 196, 141, 0.12)" : "rgba(255,255,255,0.05)"}, transparent 22rem),
      linear-gradient(135deg, ${bg} 0%, ${adjustBrightness(bg, 8)} 48%, ${adjustBrightness(bg, -4)} 100%)
    `;
  }
  scene.background.set(bg);

  const hasVisibleAsset = state.assetPlaced && section.pathPoints.length > 0;
  assetMesh.visible = hasVisibleAsset;
  grid.visible = hasVisibleAsset;
  assetHandle.hidden = !hasVisibleAsset;
  orientationGizmo.hidden = !hasVisibleAsset;
  if (!hasVisibleAsset) {
    updateStatus();
    return;
  }

  assetMesh.position.copy(pointForSection(section, state.progress));
  assetMesh.scale.setScalar(state.scale);
  const facing = facingForSection(section, state.progress);

  // Idle float animation when not playing
  let idleOffsetY = 0;
  let idleRotY = 0;
  if (!state.isPlaying && now > 0) {
    idleTime = now * 0.001;
    idleOffsetY = Math.sin(idleTime * 1.2) * 0.035;
    idleRotY = Math.sin(idleTime * 0.8) * 0.03;
  }

  assetMesh.position.y += idleOffsetY;
  assetMesh.rotation.set(
    THREE.MathUtils.degToRad(facing.pitch),
    THREE.MathUtils.degToRad(facing.yaw) + idleRotY,
    THREE.MathUtils.degToRad(facing.roll),
  );

  const screen = worldToScreen(assetMesh.position);
  assetHandle.style.left = `${screen.x}px`;
  assetHandle.style.top = `${screen.y}px`;
  const selected = selectedPathPoint();
  assetHandle.dataset.transform = `R ${Math.round(selected?.pitch ?? 0)} / ${Math.round(selected?.yaw ?? 0)} / ${Math.round(selected?.roll ?? 0)}`;
  assetHandle.title = "Drag to rotate X/Y. Hold Shift and drag to move X/Y. Scroll here to rotate Z.";
  updateStatus();
}

function adjustBrightness(hex, amount) {
  const c = hex.replace("#", "");
  const r = clamp(parseInt(c.substring(0, 2), 16) + amount, 0, 255);
  const g = clamp(parseInt(c.substring(2, 4), 16) + amount, 0, 255);
  const b = clamp(parseInt(c.substring(4, 6), 16) + amount, 0, 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/* ===================================================
   SVG Path Drawing
   =================================================== */
function drawSvgPath() {
  const section = currentSection();
  const curve = getCurveForSection(section);
  const projected =
    curve && section.pathPoints.length > 1
      ? curve.getPoints(90).map(worldToScreen)
      : section.pathPoints.map(normalizedToPixels);

  const pathData = projected
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  const anchors = section.pathPoints
    .map((point, index) => {
      const pixel = normalizedToPixels(point);
      const selected = index === state.selectedPointIndex;
      const facingAngle = THREE.MathUtils.degToRad((point.yaw ?? 0) - 90);
      const facingEnd = {
        x: pixel.x + Math.cos(facingAngle) * 24,
        y: pixel.y + Math.sin(facingAngle) * 24,
      };
      return `<g data-point-index="${index}">
        <line data-point-index="${index}" x1="${pixel.x}" y1="${pixel.y}" x2="${facingEnd.x}" y2="${facingEnd.y}" stroke="${selected ? "#6aa8ff" : "#f0b54d"}" stroke-width="3" stroke-linecap="round"></line>
        <circle data-point-index="${index}" cx="${pixel.x}" cy="${pixel.y}" r="${selected ? 8 : 6}" fill="${selected ? "#6aa8ff" : "#31c48d"}" stroke="#07100d" stroke-width="3"></circle>
        <text data-point-index="${index}" x="${pixel.x + 10}" y="${pixel.y - 10}" fill="#f4f6fb" font-size="10" font-weight="800">${index + 1}</text>
      </g>`;
    })
    .join("");

  overlay.innerHTML = pathData
    ? `
      <path d="${pathData}" fill="none" stroke="rgba(49,196,141,0.18)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="${pathData}" fill="none" stroke="#31c48d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
      ${anchors}
    `
    : "";

  overlay.classList.toggle("drawing", state.activeTool === "path");
}

/* ===================================================
   Website Layer (Text Nodes)
   =================================================== */
function renderWebsiteLayer() {
  const section = currentSection();
  websiteLayer.innerHTML = section.texts
    .map(
      (item) => `
        <div
          class="text-node ${item.id === state.selectedTextId ? "active" : ""} ${item.visible === false ? "hidden-layer" : ""}"
          contenteditable="true"
          spellcheck="false"
          data-id="${item.id}"
          data-kind="${item.kind}"
          style="left:${item.x * 100}%; top:${item.y * 100}%; font-size:${item.size}px; color:${item.color || (item.kind === "body" ? "#4b5563" : "#111827")}; opacity:${item.visible === false ? 0.2 : 1};"
        >${escapeHtml(item.text)}</div>
      `,
    )
    .join("");

  websiteLayer.querySelectorAll(".text-node").forEach((node) => {
    node.addEventListener("pointerdown", startTextDrag);
    node.addEventListener("input", updateTextContent);
    node.addEventListener("focus", () => {
      state.selectedTextId = node.dataset.id;
      renderLayerList();
      markSelectedText();
      syncTextFormatPanel();
    });
  });
}

function markSelectedText() {
  websiteLayer.querySelectorAll(".text-node").forEach((node) => {
    node.classList.toggle("active", node.dataset.id === state.selectedTextId);
  });
}

/* ===================================================
   Text Format Panel
   =================================================== */
function syncTextFormatPanel() {
  const item = state.selectedTextId ? findText(state.selectedTextId) : null;
  textFormatPanel.style.display = item ? "" : "none";
  if (!item) return;
  textKindSelect.value = item.kind;
  textSizeInput.value = item.size;
  const color = item.color || (item.kind === "body" ? "#4b5563" : "#111827");
  textColorInput.value = color;
  textColorHex.value = color;
}

/* ===================================================
   Inspector & Point Sync
   =================================================== */
function syncPointInspector() {
  const section = currentSection();
  pointList.innerHTML = section.pathPoints
    .map(
      (_point, index) => `
        <button class="point-button ${index === state.selectedPointIndex ? "active" : ""}" data-point="${index}" type="button">
          ${index + 1}
        </button>
      `,
    )
    .join("");

  pointList.querySelectorAll(".point-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectPathPoint(Number(button.dataset.point));
    });
  });

  const point = selectedPathPoint();
  pointLabel.textContent = point ? `Point ${state.selectedPointIndex + 1} transform` : "No path point";
  pointXInput.disabled = !point;
  pointYInput.disabled = !point;
  pointZInput.disabled = !point;
  pointYawInput.disabled = !point;
  pointPitchInput.disabled = !point;
  pointRollInput.disabled = !point;
  if (point) {
    pointXInput.value = pointToAxisX(point);
    pointYInput.value = pointToAxisY(point);
    pointZInput.value = point.z ?? 0;
    state.pathDepth = point.z ?? 0;
    depthInput.value = state.pathDepth;
    pointYawInput.value = point.yaw ?? 0;
    pointPitchInput.value = point.pitch ?? 0;
    pointRollInput.value = point.roll ?? 0;
  }
}

function selectPathPoint(index) {
  const section = currentSection();
  if (section.pathPoints.length === 0) return;
  state.selectedPointIndex = clamp(index, 0, section.pathPoints.length - 1);
  setProgressToSelectedPoint();
  syncPointInspector();
  drawSvgPath();
  updateSceneFromState();
  updateStatus();
}

/* ===================================================
   Section & Layer List Rendering
   =================================================== */
function renderSectionPages() {
  stagePages.classList.toggle("connected", state.sections.length > 1);
  const pageMarkup = (section, index) => {
    const headline = section.texts.find((item) => item.kind === "headline")?.text || section.name;
    const body = section.texts.find((item) => item.kind === "body")?.text || `${section.pathPoints.length} animation point${section.pathPoints.length === 1 ? "" : "s"}`;
    return `
      <button class="section-page-preview" data-section-preview="${index}" type="button" style="background:${section.bgColor || "#ffffff"}">
        <span>${escapeHtml(section.name)}</span>
        <strong>${escapeHtml(headline)}</strong>
        <em>${escapeHtml(body)}</em>
      </button>
    `;
  };

  sectionPagesBefore.innerHTML = state.sections
    .slice(0, state.currentSectionIndex)
    .map((section, offset) => pageMarkup(section, offset))
    .join("");

  sectionPagesAfter.innerHTML = state.sections
    .slice(state.currentSectionIndex + 1)
    .map((section, offset) => pageMarkup(section, state.currentSectionIndex + 1 + offset))
    .join("");

  document.querySelectorAll("[data-section-preview]").forEach((button) => {
    button.addEventListener("click", () => switchSection(Number(button.dataset.sectionPreview)));
  });
}

function reorderSection(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
  saveSnapshot();
  const [moved] = state.sections.splice(fromIndex, 1);
  state.sections.splice(toIndex, 0, moved);
  if (state.currentSectionIndex === fromIndex) {
    state.currentSectionIndex = toIndex;
  } else if (fromIndex < state.currentSectionIndex && toIndex >= state.currentSectionIndex) {
    state.currentSectionIndex--;
  } else if (fromIndex > state.currentSectionIndex && toIndex <= state.currentSectionIndex) {
    state.currentSectionIndex++;
  }
  fullRefresh();
  showToast(`Moved "${moved.name}"`);
}

function renderSectionList() {
  sectionList.innerHTML = state.sections
    .map(
      (section, index) => `
        <div class="section-row" draggable="true" data-section-row="${index}">
          <button class="section-item ${index === state.currentSectionIndex ? "active" : ""}" data-index="${index}" type="button">
            <span class="drag-grip" aria-hidden="true">⋮⋮</span>
            <span>${escapeHtml(section.name)}</span>
            <em>${section.pathPoints.length} pts</em>
            ${state.sections.length > 1 ? `<button class="item-delete-btn" data-delete-section="${index}" type="button" title="Delete section" aria-label="Delete ${escapeHtml(section.name)}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></svg></button>` : ""}
          </button>
          <button class="section-insert" data-after="${index}" type="button" title="Add section after ${escapeHtml(section.name)}">+</button>
        </div>
      `,
    )
    .join("");

  sectionList.querySelectorAll(".section-row").forEach((row) => {
    row.addEventListener("dragstart", (event) => {
      state.draggedSectionIndex = Number(row.dataset.sectionRow);
      row.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", row.dataset.sectionRow);
    });
    row.addEventListener("dragend", () => {
      state.draggedSectionIndex = null;
      row.classList.remove("dragging");
      sectionList.querySelectorAll(".section-row").forEach((item) => item.classList.remove("drop-target"));
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (state.draggedSectionIndex === null) return;
      row.classList.add("drop-target");
      event.dataTransfer.dropEffect = "move";
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop-target"));
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("drop-target");
      const fromIndex = state.draggedSectionIndex ?? Number(event.dataTransfer.getData("text/plain"));
      reorderSection(fromIndex, Number(row.dataset.sectionRow));
    });
  });

  sectionList.querySelectorAll(".section-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.closest(".item-delete-btn")) return;
      switchSection(Number(button.dataset.index));
    });
    // Double-click to rename inline
    button.addEventListener("dblclick", (e) => {
      e.preventDefault();
      const spanEl = button.querySelector("span");
      const idx = Number(button.dataset.index);
      const original = state.sections[idx].name;
      spanEl.contentEditable = "true";
      spanEl.focus();
      document.getSelection()?.selectAllChildren(spanEl);
      const finish = () => {
        spanEl.contentEditable = "false";
        const newName = spanEl.textContent.trim() || original;
        state.sections[idx].name = newName;
        updateSectionFields();
        renderSectionList();
        renderSectionPages();
        saveSnapshot();
      };
      spanEl.addEventListener("blur", finish, { once: true });
      spanEl.addEventListener("keydown", (ke) => {
        if (ke.key === "Enter") { ke.preventDefault(); spanEl.blur(); }
        if (ke.key === "Escape") { spanEl.textContent = original; spanEl.blur(); }
      });
    });
  });

  // Delete section buttons
  sectionList.querySelectorAll("[data-delete-section]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSection(Number(btn.dataset.deleteSection));
    });
  });

  sectionList.querySelectorAll(".section-insert").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addSection(Number(button.dataset.after));
    });
  });
}

function renderLayerList() {
  const section = currentSection();
  const textLayers = section.texts
    .map(
      (item) => `
        <button class="layer-item ${item.id === state.selectedTextId ? "active" : ""}" data-id="${item.id}" type="button">
          <span style="${item.visible === false ? "opacity:0.4;text-decoration:line-through" : ""}">${escapeHtml(item.text || "Text")}</span>
          <button class="item-delete-btn" data-delete-text="${item.id}" type="button" title="Delete text layer" aria-label="Delete text"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></svg></button>
          <em>${item.kind === "body" ? "P" : "H"}</em>
        </button>
      `,
    )
    .join("");

  layerList.innerHTML = `
    <button class="layer-item ${state.selectedTextId ? "" : "active"}" data-layer="model" type="button">
      <span>3D model</span>
      <em>3D</em>
    </button>
    ${textLayers}
  `;

  layerList.querySelectorAll(".layer-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.closest(".item-delete-btn")) return;
      state.selectedTextId = button.dataset.id ?? null;
      setTool("move");
      markSelectedText();
      renderLayerList();
      syncTextFormatPanel();
    });
  });

  // Delete text buttons
  layerList.querySelectorAll("[data-delete-text]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteText(btn.dataset.deleteText);
    });
  });
}

/* ===================================================
   Section Switching & Navigation
   =================================================== */
function updateSectionFields() {
  const section = currentSection();
  sectionNameInput.value = section.name;
  sectionTitleLabel.textContent = section.name;
  canvasSectionName.textContent = section.name;
  sectionBgInput.value = section.bgColor || "#ffffff";
  sectionBgHex.value = section.bgColor || "#ffffff";
  easingSelect.value = section.easing || "easeInOut";
  durationInput.value = section.duration || 3200;

  // Sync bezier coordinate editor values
  if (section.customBezier) {
    bezierX1.value = section.customBezier[0];
    bezierY1.value = section.customBezier[1];
    bezierX2.value = section.customBezier[2];
    bezierY2.value = section.customBezier[3];
  }
  toggleBezierEditorVisibility();
}

function toggleBezierEditorVisibility() {
  const display = easingSelect.value === "custom" ? "flex" : "none";
  bezierEditorPanel.style.display = display;
  if (easingSelect.value === "custom") {
    drawBezierCanvas();
  }
}

function switchSection(index, options = {}) {
  state.currentSectionIndex = clamp(index, 0, state.sections.length - 1);
  state.selectedTextId = null;
  const pointCount = currentSection().pathPoints.length;
  state.selectedPointIndex = pointCount ? clamp(state.selectedPointIndex, 0, pointCount - 1) : 0;
  if (!options.keepProgress) {
    state.progress = 0;
    state.isPlaying = false;
  }
  updateSectionFields();
  renderSectionList();
  renderSectionPages();
  renderLayerList();
  renderWebsiteLayer();
  syncPointInspector();
  syncTextFormatPanel();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  syncPlayButton();
  updateScrubber();
}

function fullRefresh() {
  updateSectionFields();
  renderSectionList();
  renderSectionPages();
  renderLayerList();
  renderWebsiteLayer();
  syncPointInspector();
  syncTextFormatPanel();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  syncPlayButton();
  updateScrubber();
}

/* ===================================================
   Tools
   =================================================== */
function setTool(tool) {
  state.activeTool = tool;
  document.querySelectorAll(".tool-button[data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
  drawSvgPath();
  updateStatus();
}

function updateStatus() {
  if (state.isPlaying) {
    viewportStatus.textContent = state.animateAllSections ? "Playing all" : "Playing section";
    return;
  }
  if (state.drag?.type === "asset-rotation") {
    viewportStatus.textContent = "Rotate mode";
    return;
  }
  if (state.drag?.type === "asset-position") {
    viewportStatus.textContent = "Move position";
    return;
  }
  if (state.activeTool === "path") {
    const total = currentSection().pathPoints.length;
    viewportStatus.textContent = total ? `Point ${state.selectedPointIndex + 1} / ${total}` : "Click to add point";
    return;
  }
  viewportStatus.textContent = state.selectedTextId ? "Text selected" : "Move mode";
}

/* ===================================================
   Path Editing
   =================================================== */
function addPathPoint(event) {
  if (state.activeTool !== "path") return;
  const selectedAnchor = event.target.closest?.("[data-point-index]");
  if (selectedAnchor) {
    selectPathPoint(Number(selectedAnchor.dataset.pointIndex));
    return;
  }
  saveSnapshot();
  const point = clientToNormalized(event.clientX, event.clientY);
  const section = currentSection();
  const previous = section.pathPoints.at(-1);
  const pathPoint = createPathPoint(
    point.x,
    point.y,
    previous?.yaw ?? 0,
    previous?.pitch ?? 0,
    previous?.roll ?? 0,
    previous?.z ?? state.pathDepth,
  );
  section.pathPoints.push(pathPoint);
  state.assetPlaced = true;
  state.selectedPointIndex = section.pathPoints.length - 1;
  if (section.pathPoints.length === 1) section.modelPoint = pathPoint;
  setProgressToSelectedPoint();
  syncPointInspector();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  renderSectionList();
}

function moveModelTo(clientX, clientY) {
  const section = currentSection();
  const point = clientToNormalized(clientX, clientY);
  state.assetPlaced = true;
  if (section.pathPoints.length === 0) {
    section.pathPoints.push(createPathPoint(point.x, point.y, 0, 0, 0, state.pathDepth));
    section.modelPoint = section.pathPoints[0];
    state.selectedPointIndex = 0;
  } else {
    const selected = selectedPathPoint();
    selected.x = point.x;
    selected.y = point.y;
    if (state.selectedPointIndex === 0) section.modelPoint = selected;
  }
  setProgressToSelectedPoint();
  syncPointInspector();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  renderSectionList();
}

function setSelectedPointRotation({ pitch, yaw, roll }) {
  const point = selectedPathPoint();
  if (!point) return;
  if (pitch !== undefined) {
    point.pitch = clamp(Number(pitch), -180, 180);
    pointPitchInput.value = point.pitch;
  }
  if (yaw !== undefined) {
    point.yaw = clamp(Number(yaw), -180, 180);
    pointYawInput.value = point.yaw;
  }
  if (roll !== undefined) {
    point.roll = clamp(Number(roll), -180, 180);
    pointRollInput.value = point.roll;
  }
  setProgressToSelectedPoint();
  drawSvgPath();
  updateSceneFromState();
}

/* ===================================================
   Drag Handlers
   =================================================== */
let rotationWheelSnapshotTimer = null;
let isPositionModifierDown = false;

function isPositionDrag(event) {
  return event.shiftKey || isPositionModifierDown;
}

function beginAssetRotationDrag(event) {
  const point = selectedPathPoint();
  state.drag = {
    type: "asset-rotation",
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startPitch: point?.pitch ?? 0,
    startYaw: point?.yaw ?? 0,
  };
  assetHandle.classList.add("rotation-dragging");
  updateStatus();
}

function beginAssetPositionDrag(event) {
  state.drag = {
    type: "asset-position",
    pointerId: event.pointerId,
  };
  assetHandle.classList.remove("rotation-dragging");
  moveModelTo(event.clientX, event.clientY);
  updateStatus();
}

function startAssetDrag(event) {
  if (state.activeTool !== "move") return;
  event.preventDefault();
  saveSnapshot();
  assetHandle.setPointerCapture(event.pointerId);
  if (isPositionDrag(event)) {
    beginAssetPositionDrag(event);
    return;
  }
  beginAssetRotationDrag(event);
}

function dragAsset(event) {
  if (!state.drag) return;
  if (state.drag.type === "asset-rotation" && isPositionDrag(event)) {
    beginAssetPositionDrag(event);
    return;
  }
  if (state.drag.type === "asset-position") {
    moveModelTo(event.clientX, event.clientY);
    return;
  }
  if (state.drag.type === "asset-rotation") {
    setSelectedPointRotation({
      pitch: state.drag.startPitch + (state.drag.startY - event.clientY) * 0.55,
      yaw: state.drag.startYaw + (event.clientX - state.drag.startX) * 0.55,
    });
    return;
  }
}

function nudgeAssetRotation(event) {
  if (state.activeTool !== "move" || assetHandle.hidden) return;
  const point = selectedPathPoint();
  if (!point) return;
  event.preventDefault();
  if (!rotationWheelSnapshotTimer) saveSnapshot();
  clearTimeout(rotationWheelSnapshotTimer);
  rotationWheelSnapshotTimer = setTimeout(() => {
    rotationWheelSnapshotTimer = null;
  }, 350);
  setSelectedPointRotation({ roll: (point.roll ?? 0) - event.deltaY * 0.25 });
}

function stopDrag(event) {
  if (!state.drag) return;
  if (state.drag.pointerId && event.currentTarget.releasePointerCapture) {
    try {
      event.currentTarget.releasePointerCapture(state.drag.pointerId);
    } catch {
      // Pointer capture can belong to a child text node while the event bubbles through the layer.
    }
  }
  assetHandle.classList.remove("rotation-dragging");
  state.drag = null;
}

function startTextDrag(event) {
  const node = event.currentTarget;
  const item = findText(node.dataset.id);
  if (!item) return;
  saveSnapshot();
  state.selectedTextId = item.id;
  setTool("move");
  renderLayerList();
  markSelectedText();
  syncTextFormatPanel();

  const nodeRect = node.getBoundingClientRect();
  const layerRect = websiteLayer.getBoundingClientRect();
  state.drag = {
    type: "text",
    id: item.id,
    pointerId: event.pointerId,
    offsetX: event.clientX - nodeRect.left,
    offsetY: event.clientY - nodeRect.top,
    width: layerRect.width,
    height: layerRect.height,
  };
  node.setPointerCapture(event.pointerId);
}

function dragText(event) {
  if (!state.drag || state.drag.type !== "text") return;
  const item = findText(state.drag.id);
  if (!item) return;
  const layerRect = websiteLayer.getBoundingClientRect();
  
  const rawX = (event.clientX - layerRect.left - state.drag.offsetX) / layerRect.width;
  // Apply Figma snap grids if toggled
  item.x = clamp(calculateGridSnapping(rawX), 0, 0.92);
  item.y = clamp((event.clientY - layerRect.top - state.drag.offsetY) / layerRect.height, 0, 0.9);
  
  const node = websiteLayer.querySelector(`[data-id="${item.id}"]`);
  if (node) {
    node.style.left = `${item.x * 100}%`;
    node.style.top = `${item.y * 100}%`;
  }
}

function updateTextContent(event) {
  const item = findText(event.currentTarget.dataset.id);
  if (!item) return;
  item.text = event.currentTarget.textContent.trim() || "Text";
  renderLayerList();
}

function findText(id) {
  return currentSection().texts.find((item) => item.id === id);
}

/* ===================================================
   Add / Delete Operations
   =================================================== */
function addTextLayer() {
  saveSnapshot();
  const section = currentSection();
  const offset = section.texts.length * 0.055;
  const text = createText("New text", 0.14 + offset, 0.18 + offset, 36);
  section.texts.push(text);
  state.selectedTextId = text.id;
  setTool("move");
  renderWebsiteLayer();
  renderLayerList();
  renderSectionPages();
  syncTextFormatPanel();
  const node = websiteLayer.querySelector(`[data-id="${text.id}"]`);
  if (node) {
    node.focus();
    document.getSelection()?.selectAllChildren(node);
  }
  showToast("Text layer added");
}

function addSection(afterIndex = state.sections.length - 1) {
  saveSnapshot();
  const index = state.sections.length + 1;
  const section = createSection(`Section ${index}`, [], [], "#ffffff");
  state.sections.splice(afterIndex + 1, 0, section);
  switchSection(afterIndex + 1);
  showToast(`Section "${section.name}" added`);
}

function addSectionAtEnd() {
  addSection(state.sections.length - 1);
}

function deleteSection(index) {
  if (state.sections.length <= 1) {
    showToast("Cannot delete the last section");
    return;
  }
  saveSnapshot();
  const name = state.sections[index].name;
  state.sections.splice(index, 1);
  if (state.currentSectionIndex >= state.sections.length) {
    state.currentSectionIndex = state.sections.length - 1;
  }
  switchSection(state.currentSectionIndex);
  showToast(`Deleted "${name}"`);
}

function deleteText(id) {
  saveSnapshot();
  const section = currentSection();
  const idx = section.texts.findIndex((t) => t.id === id);
  if (idx === -1) return;
  section.texts.splice(idx, 1);
  if (state.selectedTextId === id) state.selectedTextId = null;
  renderWebsiteLayer();
  renderLayerList();
  syncTextFormatPanel();
  showToast("Text layer deleted");
}

function deleteSelectedPathPoint() {
  const section = currentSection();
  if (section.pathPoints.length === 0) return;
  saveSnapshot();
  section.pathPoints.splice(state.selectedPointIndex, 1);
  if (state.selectedPointIndex >= section.pathPoints.length) {
    state.selectedPointIndex = Math.max(0, section.pathPoints.length - 1);
  }
  if (section.pathPoints.length > 0) {
    section.modelPoint = section.pathPoints[0];
  } else {
    state.assetPlaced = false;
  }
  setProgressToSelectedPoint();
  syncPointInspector();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  renderSectionList();
  renderSectionPages();
  showToast("Path point deleted");
}

function deleteSelected() {
  if (state.selectedTextId) {
    deleteText(state.selectedTextId);
  } else if (state.activeTool === "path") {
    deleteSelectedPathPoint();
  }
}

function duplicateSelected() {
  const section = currentSection();
  if (state.selectedTextId) {
    const item = findText(state.selectedTextId);
    if (!item) return;
    saveSnapshot();
    const dupe = createText(item.text, item.x + 0.03, item.y + 0.03, item.size, item.kind, item.color);
    section.texts.push(dupe);
    state.selectedTextId = dupe.id;
    renderWebsiteLayer();
    renderLayerList();
    syncTextFormatPanel();
    showToast("Text duplicated");
  } else if (state.activeTool === "path" && section.pathPoints.length > 0) {
    saveSnapshot();
    const point = { ...section.pathPoints[state.selectedPointIndex] };
    point.x += 0.03;
    point.y += 0.03;
    section.pathPoints.splice(state.selectedPointIndex + 1, 0, point);
    state.selectedPointIndex++;
    setProgressToSelectedPoint();
    syncPointInspector();
    updatePathLine();
    drawSvgPath();
    updateSceneFromState();
    renderSectionList();
    renderSectionPages();
    showToast("Point duplicated");
  }
}

/* ===================================================
   Playback
   =================================================== */
function playPreview() {
  if (state.isPlaying) {
    state.isPlaying = false;
    syncPlayButton();
    updateStatus();
    return;
  }

  if (state.animateAllSections) {
    state.currentSectionIndex = 0;
    state.selectedPointIndex = 0;
    updateSectionFields();
    renderSectionList();
    renderSectionPages();
    renderLayerList();
    renderWebsiteLayer();
    syncPointInspector();
    updatePathLine();
    drawSvgPath();
  }

  state.progress = 0;
  state.isPlaying = true;
  state.playStartedAt = performance.now();
  syncPlayButton();
}

function syncPlayButton() {
  playButton.classList.toggle("playing", state.isPlaying);
  timelinePlayBtn.classList.toggle("playing", state.isPlaying);
  timelineBar.classList.toggle("visible", state.isPlaying);
}

function getSectionDuration(section) {
  return section?.duration || 3200;
}

function updatePlayback(now) {
  if (!state.isPlaying) return;
  const section = currentSection();
  const easing = getEasing(section);

  if (state.animateAllSections) {
    const totalDuration = state.sections.reduce((sum, s) => sum + getSectionDuration(s), 0);
    const elapsed = now - state.playStartedAt;
    const globalProgress = clamp(elapsed / totalDuration, 0, 1);

    // Determine which section we're in
    let accumulated = 0;
    let nextIndex = 0;
    let localProgress = 0;
    for (let i = 0; i < state.sections.length; i++) {
      const dur = getSectionDuration(state.sections[i]);
      if (accumulated + dur >= elapsed || i === state.sections.length - 1) {
        nextIndex = i;
        localProgress = clamp((elapsed - accumulated) / dur, 0, 1);
        break;
      }
      accumulated += dur;
    }

    if (nextIndex !== state.currentSectionIndex) {
      state.currentSectionIndex = nextIndex;
      state.selectedPointIndex = 0;
      updateSectionFields();
      renderSectionList();
      renderSectionPages();
      renderLayerList();
      renderWebsiteLayer();
      syncPointInspector();
      updatePathLine();
      drawSvgPath();
    }

    const sectionEasing = getEasing(state.sections[nextIndex]);
    state.progress = sectionEasing(localProgress);

    if (globalProgress >= 1) {
      if (state.loopPlayback) {
        state.playStartedAt = now;
        state.currentSectionIndex = 0;
        switchSection(0, { keepProgress: true });
      } else {
        state.isPlaying = false;
        syncPlayButton();
      }
    }
  } else {
    const duration = getSectionDuration(section);
    const rawProgress = clamp((now - state.playStartedAt) / duration, 0, 1);
    state.progress = easing(rawProgress);

    if (rawProgress >= 1) {
      if (state.loopPlayback) {
        state.playStartedAt = now;
        state.progress = 0;
      } else {
        state.isPlaying = false;
        syncPlayButton();
      }
    }
  }

  updateScrubber();
}

function updateScrubber() {
  scrubber.value = state.progress;
  const section = currentSection();
  const duration = getSectionDuration(section);
  const currentMs = state.progress * duration;
  timeDisplay.textContent = `${(currentMs / 1000).toFixed(1)}s / ${(duration / 1000).toFixed(1)}s`;
}

/* ===================================================
   Zoom & Pan
   =================================================== */
function setZoom(newZoom, centerX, centerY) {
  const oldZoom = state.zoom;
  state.zoom = clamp(newZoom, 0.25, 4);

  if (centerX !== undefined && centerY !== undefined) {
    const zoomRatio = state.zoom / oldZoom;
    state.panX = centerX - (centerX - state.panX) * zoomRatio;
    state.panY = centerY - (centerY - state.panY) * zoomRatio;
  }

  stagePages.style.zoom = state.zoom;
  stagePages.style.transform = `translate(${state.panX / state.zoom}px, ${state.panY / state.zoom}px)`;
  stagePages.style.setProperty("--rail-scale", state.zoom);
  zoomLevelBadge.textContent = `${Math.round(state.zoom * 100)}%`;
  if (inspectorZoomCopy) inspectorZoomCopy.textContent = `${Math.round(state.zoom * 100)}%`;
}

function zoomIn() {
  setZoom(state.zoom * 1.15);
}

function zoomOut() {
  setZoom(state.zoom / 1.15);
}

function zoomReset() {
  state.panX = 0;
  state.panY = 0;
  setZoom(1);
}

/* ===================================================
   Code Generation & Export Compiler
   =================================================== */
function generateCode() {
  if (state.exportFormat === "react") {
    return generateReactCode();
  }
  return generateVanillaCode();
}

function generateVanillaCode() {
  const exportedSections = state.animateAllSections ? state.sections : [currentSection()];
  const sceneData = {
    asset: state.asset,
    cameraZ: Number(state.cameraZ.toFixed(2)),
    scale: Number(state.scale.toFixed(2)),
    light: state.light,
    sections: exportedSections.map((section) => ({
      name: section.name,
      bgColor: section.bgColor || "#ffffff",
      easing: section.easing || "easeInOut",
      customBezier: section.customBezier || [0.25, 0.25, 0.75, 0.75],
      duration: section.duration || 3200,
      path: exportPointsForSection(section),
      texts: section.texts.map((item) => ({
        text: item.text,
        x: Number(item.x.toFixed(3)),
        y: Number(item.y.toFixed(3)),
        size: item.size,
        kind: item.kind,
        color: item.color || (item.kind === "body" ? "#4b5563" : "#111827"),
      })),
    })),
  };

  const json = JSON.stringify(sceneData, null, 2).replaceAll("</script>", "<\\/script>");
  return `<!-- PathForge export: ${state.animateAllSections ? "multi-section" : "single-section"} 3D website animation -->
<div id="pathforge-site"></div>
<script type="module">
import * as THREE from "https://esm.sh/three@0.164.1";

const data = ${json};
const mount = document.querySelector("#pathforge-site");
mount.style.position = "relative";
mount.style.background = "#ffffff";
mount.style.color = "#111827";
mount.style.fontFamily = "Inter, system-ui, sans-serif";

const canvasHost = document.createElement("div");
canvasHost.style.position = "sticky";
canvasHost.style.top = "0";
canvasHost.style.height = "100vh";
canvasHost.style.zIndex = "2";
mount.appendChild(canvasHost);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasHost.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.8, data.cameraZ);

scene.add(new THREE.AmbientLight("#ffffff", 0.75));
const keyLight = new THREE.DirectionalLight("#ffffff", 2.2);
keyLight.position.set(3.5, 4, 5);
scene.add(keyLight);

const asset = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: "#31c48d", roughness: 0.28, metalness: 0.18 })
);
asset.scale.setScalar(data.scale);
scene.add(asset);

const easings = {
  linear: t => t,
  easeIn: t => t * t * t,
  easeOut: t => 1 - Math.pow(1 - t, 3),
  easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1,
};

function solveCubicBezier(x1, y1, x2, y2) {
  return function(x) {
    if (x === 0 || x === 1) return x;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const currentX = 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) - x;
      if (Math.abs(currentX) < 0.001) break;
      const derivativeX = 3 * Math.pow(1 - t, 2) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * Math.pow(t, 2) * (1 - x2);
      if (Math.abs(derivativeX) < 1e-6) break;
      t -= currentX / derivativeX;
    }
    return 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3);
  };
}

data.sections.forEach((section) => {
  const block = document.createElement("section");
  block.style.position = "relative";
  block.style.minHeight = "140vh";
  block.style.padding = "12vw 8vw";
  block.style.zIndex = "3";
  block.style.background = section.bgColor || "#ffffff";
  block.dataset.pathforgeSection = section.name;
  section.texts.forEach((item) => {
    const text = document.createElement(item.kind === "body" ? "p" : "h2");
    text.textContent = item.text;
    text.style.position = "absolute";
    text.style.left = item.x * 100 + "%";
    text.style.top = item.y * 100 + "%";
    text.style.maxWidth = "560px";
    text.style.margin = "0";
    text.style.fontSize = item.size + "px";
    text.style.lineHeight = item.kind === "body" ? "1.35" : "1.04";
    text.style.color = item.color || (item.kind === "body" ? "#4b5563" : "#111827");
    block.appendChild(text);
  });
  mount.appendChild(block);
});

function curveFor(path) {
  const vectors = path.map((point) => new THREE.Vector3(point.position[0], point.position[1], point.position[2]));
  return vectors.length > 1
    ? new THREE.CatmullRomCurve3(vectors, false, "catmullrom", 0.5)
    : { getPoint: () => vectors[0] ?? new THREE.Vector3() };
}

function facingFor(path, progress) {
  if (path.length === 0) return { yaw: 0, pitch: 0, roll: 0 };
  if (path.length === 1) return path[0];
  const scaled = Math.min(1, Math.max(0, progress)) * (path.length - 1);
  const index = Math.min(path.length - 2, Math.floor(scaled));
  const local = scaled - index;
  return {
    yaw: path[index].yaw + (path[index + 1].yaw - path[index].yaw) * local,
    pitch: path[index].pitch + (path[index + 1].pitch - path[index].pitch) * local,
    roll: path[index].roll + (path[index + 1].roll - path[index].roll) * local,
  };
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  const blocks = [...mount.querySelectorAll("[data-pathforge-section]")];
  const activeIndex = Math.max(0, blocks.findIndex((block) => {
    const rect = block.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
  }));
  const block = blocks[activeIndex] ?? blocks[0];
  const rect = block.getBoundingClientRect();
  const max = Math.max(1, rect.height - window.innerHeight);
  const rawProgress = Math.min(1, Math.max(0, -rect.top / max));
  const sectionData = data.sections[activeIndex] ?? data.sections[0];
  
  let ease = easings.easeInOut;
  if (sectionData.easing === "custom" && sectionData.customBezier) {
    const cb = sectionData.customBezier;
    ease = solveCubicBezier(cb[0], cb[1], cb[2], cb[3]);
  } else if (easings[sectionData.easing]) {
    ease = easings[sectionData.easing];
  }
  
  const progress = ease(rawProgress);
  const path = sectionData.path;
  const curve = curveFor(path);
  const facing = facingFor(path, progress);
  asset.position.copy(curve.getPoint(progress));
  asset.rotation.set(
    THREE.MathUtils.degToRad(facing.pitch),
    THREE.MathUtils.degToRad(facing.yaw),
    THREE.MathUtils.degToRad(facing.roll)
  );
  scene.background.set(sectionData.bgColor || "#ffffff");
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
animate();
</script>`;
}

function generateReactCode() {
  const exportedSections = state.animateAllSections ? state.sections : [currentSection()];
  const sceneData = {
    asset: state.asset,
    cameraZ: Number(state.cameraZ.toFixed(2)),
    scale: Number(state.scale.toFixed(2)),
    light: state.light,
    sections: exportedSections.map((section) => ({
      name: section.name,
      bgColor: section.bgColor || "#ffffff",
      easing: section.easing || "easeInOut",
      customBezier: section.customBezier || [0.25, 0.25, 0.75, 0.75],
      duration: section.duration || 3200,
      path: exportPointsForSection(section),
      texts: section.texts.map((item) => ({
        text: item.text,
        x: Number(item.x.toFixed(3)),
        y: Number(item.y.toFixed(3)),
        size: item.size,
        kind: item.kind,
        color: item.color || (item.kind === "body" ? "#4b5563" : "#111827"),
      })),
    })),
  };

  const json = JSON.stringify(sceneData, null, 2);
  
  return `/* 
  PathForge Export: React (R3F) Component 
  Install dependencies:
  npm install three @react-three/fiber @react-three/drei
*/

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const data = ${json};

const easings = {
  linear: t => t,
  easeIn: t => t * t * t,
  easeOut: t => 1 - Math.pow(1 - t, 3),
  easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1,
};

function solveCubicBezier(x1, y1, x2, y2) {
  return function(x) {
    if (x === 0 || x === 1) return x;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const currentX = 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) - x;
      if (Math.abs(currentX) < 0.001) break;
      const derivativeX = 3 * Math.pow(1 - t, 2) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * Math.pow(t, 2) * (1 - x2);
      if (Math.abs(derivativeX) < 1e-6) break;
      t -= currentX / derivativeX;
    }
    return 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3);
  };
}

function curveFor(path) {
  const vectors = path.map((point) => new THREE.Vector3(point.position[0], point.position[1], point.position[2]));
  return vectors.length > 1
    ? new THREE.CatmullRomCurve3(vectors, false, "catmullrom", 0.5)
    : { getPoint: () => vectors[0] ?? new THREE.Vector3() };
}

function facingFor(path, progress) {
  if (path.length === 0) return { yaw: 0, pitch: 0, roll: 0 };
  if (path.length === 1) return path[0];
  const scaled = Math.min(1, Math.max(0, progress)) * (path.length - 1);
  const index = Math.min(path.length - 2, Math.floor(scaled));
  const local = scaled - index;
  return {
    yaw: path[index].yaw + (path[index + 1].yaw - path[index].yaw) * local,
    pitch: path[index].pitch + (path[index + 1].pitch - path[index].pitch) * local,
    roll: path[index].roll + (path[index + 1].roll - path[index].roll) * local,
  };
}

function Scene3D({ scrollProgress, activeSectionIndex }) {
  const meshRef = useRef();
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0.8, data.cameraZ);
  }, [camera]);

  useFrame(() => {
    if (!meshRef.current) return;
    const sectionData = data.sections[activeSectionIndex] || data.sections[0];
    
    let ease = easings.easeInOut;
    if (sectionData.easing === 'custom' && sectionData.customBezier) {
      const cb = sectionData.customBezier;
      ease = solveCubicBezier(cb[0], cb[1], cb[2], cb[3]);
    } else if (easings[sectionData.easing]) {
      ease = easings[sectionData.easing];
    }
    
    const progress = ease(scrollProgress);
    const path = sectionData.path;
    const curve = curveFor(path);
    const facing = facingFor(path, progress);
    
    meshRef.current.position.copy(curve.getPoint(progress));
    meshRef.current.rotation.set(
      THREE.MathUtils.degToRad(facing.pitch),
      THREE.MathUtils.degToRad(facing.yaw),
      THREE.MathUtils.degToRad(facing.roll)
    );
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3.5, 4, 5]} intensity={2.2} />
      <mesh ref={meshRef} scale={data.scale}>
        {data.asset === 'cube' ? (
          <>
            <boxGeometry args={[1.15, 1.15, 1.15]} />
            <meshStandardMaterial color="#31c48d" roughness={0.28} metalness={0.18} />
          </>
        ) : data.asset === 'orb' ? (
          <>
            <sphereGeometry args={[0.72, 32, 32]} />
            <meshStandardMaterial color="#8f7cff" roughness={0.18} metalness={0.35} />
          </>
        ) : data.asset === 'ring' ? (
          <>
            <torusKnotGeometry args={[0.52, 0.16, 64, 12]} />
            <meshStandardMaterial color="#f0b54d" roughness={0.26} metalness={0.28} />
          </>
        ) : (
          <>
            <capsuleGeometry args={[0.28, 1.1, 8, 16]} />
            <meshStandardMaterial color="#f4f7fb" roughness={0.34} metalness={0.22} />
          </>
        )}
      </mesh>
    </>
  );
}

export default function PathForgeSite() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('[data-pathforge-section]');
      
      let activeIdx = 0;
      sections.forEach((sec, idx) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
          activeIdx = idx;
        }
      });
      
      setActiveSectionIndex(activeIdx);
      
      const activeSec = sections[activeIdx];
      if (activeSec) {
        const rect = activeSec.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));
        setScrollProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', background: '#ffffff', color: '#11151b' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 2, background: data.sections[activeSectionIndex]?.bgColor || '#ffffff', transition: 'background-color 0.3s' }}>
        <Canvas>
          <Scene3D scrollProgress={scrollProgress} activeSectionIndex={activeSectionIndex} />
        </Canvas>
      </div>
      
      {data.sections.map((section, idx) => (
        <section
          key={idx}
          data-pathforge-section={section.name}
          style={{
            position: 'relative',
            minHeight: '140vh',
            padding: '12vw 8vw',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        >
          <div style={{ pointerEvents: 'auto', position: 'relative', width: '100%', height: '100%' }}>
            {section.texts.map((item, tIdx) => {
              const Tag = item.kind === 'body' ? 'p' : 'h2';
              return (
                <Tag
                  key={tIdx}
                  style={{
                    position: 'absolute',
                    left: item.x * 100 + '%',
                    top: item.y * 100 + '%',
                    maxWidth: '560px',
                    margin: 0,
                    fontSize: item.size + 'px',
                    lineHeight: item.kind === 'body' ? '1.35' : '1.04',
                    color: item.color,
                  }}
                >
                  {item.text}
                </Tag>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
`;
}

async function openCodeModal() {
  const code = generateCode();
  generatedCode.textContent = code;
  codeModal.hidden = false;
  await copyCode(code);
}

async function copyCode(code = generatedCode.textContent) {
  try {
    await navigator.clipboard.writeText(code);
    copyStatus.textContent = "✓ Copied to clipboard";
    showToast("Code copied to clipboard");
  } catch {
    copyStatus.textContent = "Code ready to copy";
  }
}

function downloadAsHtml() {
  const code = generateVanillaCode();
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PathForge Export</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; }
    body { font-family: Inter, system-ui, sans-serif; background: #ffffff; color: #11151b; }
  </style>
</head>
<body>
${code}
</body>
</html>`;
  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pathforge-export.html";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Downloaded HTML file");
}

/* ===================================================
   Context Menu
   =================================================== */
function showContextMenu(x, y, items) {
  contextMenuBody.innerHTML = items
    .map((item) => {
      if (item.divider) return '<div class="ctx-divider"></div>';
      return `<button class="ctx-item ${item.danger ? "danger" : ""}" data-action="${item.action}" type="button">
        <span>${item.label}</span>
        ${item.shortcut ? `<span class="ctx-shortcut">${item.shortcut}</span>` : ""}
      </button>`;
    })
    .join("");

  contextMenu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
  contextMenu.style.top = `${Math.min(y, window.innerHeight - 200)}px`;
  contextMenu.hidden = false;

  contextMenuBody.querySelectorAll(".ctx-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      contextMenu.hidden = true;
      handleContextAction(action);
    });
  });
}

function hideContextMenu() {
  contextMenu.hidden = true;
}

function handleContextAction(action) {
  switch (action) {
    case "add-point":
      setTool("path");
      break;
    case "delete-point":
      deleteSelectedPathPoint();
      break;
    case "duplicate":
      duplicateSelected();
      break;
    case "delete-selected":
      deleteSelected();
      break;
    case "add-text":
      addTextLayer();
      break;
    case "add-section":
      addSectionAtEnd();
      break;
    case "clear-path":
      saveSnapshot();
      currentSection().pathPoints = [];
      state.assetPlaced = false;
      state.selectedPointIndex = 0;
      state.progress = 0;
      syncPointInspector();
      updatePathLine();
      drawSvgPath();
      updateSceneFromState();
      renderSectionList();
      renderSectionPages();
      showToast("Path cleared");
      break;
    case "zoom-fit":
      zoomReset();
      break;
  }
}

/* ===================================================
   Figma/Spline Interactive Bezier Easing Canvas Editor
   =================================================== */
const bezierCtx = bezierCanvas.getContext("2d");

function drawBezierCanvas() {
  const cb = currentSection().customBezier || [0.25, 0.25, 0.75, 0.75];
  const w = bezierCanvas.width;
  const h = bezierCanvas.height;

  // Clear
  bezierCtx.clearRect(0, 0, w, h);

  // Bezier Space to Canvas Space
  const toCanvas = (bx, by) => ({
    x: 25 + bx * 170,
    y: 125 - by * 100 // mapped y to [0, 1] range inside 100px height grid
  });

  const p0 = toCanvas(0, 0);
  const p1 = toCanvas(cb[0], cb[1]);
  const p2 = toCanvas(cb[2], cb[3]);
  const p3 = toCanvas(1, 1);

  // Draw Grid background
  bezierCtx.strokeStyle = "#2c323d";
  bezierCtx.lineWidth = 1;
  // horizontal boundary lines
  bezierCtx.beginPath();
  bezierCtx.moveTo(25, 25);
  bezierCtx.lineTo(195, 25);
  bezierCtx.moveTo(25, 125);
  bezierCtx.lineTo(195, 125);
  // vertical boundaries
  bezierCtx.moveTo(25, 25);
  bezierCtx.lineTo(25, 125);
  bezierCtx.moveTo(195, 25);
  bezierCtx.lineTo(195, 125);
  bezierCtx.stroke();

  // Draw coordinate axis labels (0 to 1 grid)
  bezierCtx.fillStyle = "#6c7585";
  bezierCtx.font = "9px Inter";
  bezierCtx.fillText("0,0", 8, 128);
  bezierCtx.fillText("1,1", 200, 28);

  // Draw control connection lines
  bezierCtx.strokeStyle = "rgba(106, 168, 255, 0.35)";
  bezierCtx.lineWidth = 1.5;
  bezierCtx.beginPath();
  bezierCtx.moveTo(p0.x, p0.y);
  bezierCtx.lineTo(p1.x, p1.y);
  bezierCtx.moveTo(p3.x, p3.y);
  bezierCtx.lineTo(p2.x, p2.y);
  bezierCtx.stroke();

  // Draw Curve
  bezierCtx.strokeStyle = "#31c48d";
  bezierCtx.lineWidth = 3;
  bezierCtx.beginPath();
  bezierCtx.moveTo(p0.x, p0.y);
  bezierCtx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  bezierCtx.stroke();

  // Draw control handle points
  // P1 circle
  bezierCtx.fillStyle = "#6aa8ff";
  bezierCtx.beginPath();
  bezierCtx.arc(p1.x, p1.y, 6, 0, 2 * Math.PI);
  bezierCtx.fill();
  bezierCtx.strokeStyle = "#10141b";
  bezierCtx.lineWidth = 1.5;
  bezierCtx.stroke();

  // P2 circle
  bezierCtx.fillStyle = "#ff7d7d";
  bezierCtx.beginPath();
  bezierCtx.arc(p2.x, p2.y, 6, 0, 2 * Math.PI);
  bezierCtx.fill();
  bezierCtx.stroke();
}

// Drag handles on Bezier Canvas
bezierCanvas.addEventListener("pointerdown", (e) => {
  const rect = bezierCanvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  const cb = currentSection().customBezier || [0.25, 0.25, 0.75, 0.75];
  // Calculate canvas coordinates of handles
  const cx1 = 25 + cb[0] * 170;
  const cy1 = 125 - cb[1] * 100;
  const cx2 = 25 + cb[2] * 170;
  const cy2 = 125 - cb[3] * 100;

  const dist1 = Math.hypot(cx - cx1, cy - cy1);
  const dist2 = Math.hypot(cx - cx2, cy - cy2);

  if (dist1 < 10) {
    state.draggingBezierHandle = 1;
    bezierCanvas.setPointerCapture(e.pointerId);
  } else if (dist2 < 10) {
    state.draggingBezierHandle = 2;
    bezierCanvas.setPointerCapture(e.pointerId);
  }
});

bezierCanvas.addEventListener("pointermove", (e) => {
  if (state.draggingBezierHandle === 0) return;
  const rect = bezierCanvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  // Convert canvas pixel coordinates to Bezier values [0, 1]
  const bx = clamp((cx - 25) / 170, 0, 1);
  const by = clamp((125 - cy) / 100, -0.5, 1.5);

  const section = currentSection();
  if (state.draggingBezierHandle === 1) {
    section.customBezier[0] = Number(bx.toFixed(2));
    section.customBezier[1] = Number(by.toFixed(2));
    bezierX1.value = section.customBezier[0];
    bezierY1.value = section.customBezier[1];
  } else if (state.draggingBezierHandle === 2) {
    section.customBezier[2] = Number(bx.toFixed(2));
    section.customBezier[3] = Number(by.toFixed(2));
    bezierX2.value = section.customBezier[2];
    bezierY2.value = section.customBezier[3];
  }
  drawBezierCanvas();
  updateSceneFromState();
});

bezierCanvas.addEventListener("pointerup", (e) => {
  if (state.draggingBezierHandle !== 0) {
    try { bezierCanvas.releasePointerCapture(e.pointerId); } catch {}
    state.draggingBezierHandle = 0;
    saveSnapshot();
  }
});

// Sync numeric inputs in Bezier Editor
function updateBezierFromInputs() {
  const x1 = clamp(Number(bezierX1.value), 0, 1);
  const y1 = clamp(Number(bezierY1.value), -1, 2);
  const x2 = clamp(Number(bezierX2.value), 0, 1);
  const y2 = clamp(Number(bezierY2.value), -1, 2);

  const section = currentSection();
  section.customBezier = [x1, y1, x2, y2];
  bezierX1.value = x1;
  bezierY1.value = y1;
  bezierX2.value = x2;
  bezierY2.value = y2;

  drawBezierCanvas();
  updateSceneFromState();
  saveSnapshot();
}

[bezierX1, bezierY1, bezierX2, bezierY2].forEach((input) => {
  input.addEventListener("change", updateBezierFromInputs);
});

/* ===================================================
   Reset
   =================================================== */
function resetDemo() {
  state.asset = "rocket";
  state.assetPlaced = false;
  state.light = "studio";
  state.activeTool = "move";
  state.isPlaying = false;
  state.progress = 0;
  state.currentSectionIndex = 0;
  state.animateAllSections = false;
  state.pathDepth = 0;
  state.scale = 1;
  state.cameraZ = 6.2;
  state.selectedPointIndex = 0;
  state.selectedTextId = null;
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  state.loopPlayback = false;
  state.gridActive = false;
  state.exportFormat = "vanilla";
  state.sections = createDefaultSections();

  allSectionsToggle.checked = false;
  loopToggle.checked = false;
  layoutGridOverlay.hidden = true;
  toggleGridBtn.classList.remove("active");
  depthInput.value = state.pathDepth;
  scaleInput.value = state.scale;
  cameraZInput.value = state.cameraZ;

  renderAssetLibrary();
  document.querySelectorAll(".segmented[aria-label='Lighting preset'] .segment").forEach((button) => {
    button.classList.toggle("active", button.dataset.light === state.light);
  });

  setAsset(state.asset);
  setLighting(state.light);
  setTool("move");
  switchSection(0);
  zoomReset();

  // Re-initialize history
  history.stack = [];
  history.pointer = -1;
  saveSnapshot();

  showToast("Reset to default");
}

/* ===================================================
   Collapsible Panels
   =================================================== */
function initCollapsiblePanels() {
  document.querySelectorAll(".panel-collapse-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest(".panel");
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !isExpanded);
      panel.classList.toggle("collapsed", isExpanded);

      // Save state
      const key = `pf-panel-${panel.querySelector("h2")?.textContent?.trim()}`;
      sessionStorage.setItem(key, isExpanded ? "collapsed" : "expanded");
    });

    // Restore state
    const panel = btn.closest(".panel");
    const key = `pf-panel-${panel.querySelector("h2")?.textContent?.trim()}`;
    const saved = sessionStorage.getItem(key);
    if (saved === "collapsed") {
      btn.setAttribute("aria-expanded", "false");
      panel.classList.add("collapsed");
    }
  });
}

/* ===================================================
   Event Binding
   =================================================== */

// Tool buttons
document.querySelectorAll(".tool-button[data-tool]").forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

assetSearchInput.addEventListener("input", renderAssetLibrary);

// Lighting presets
document.querySelectorAll(".segmented[aria-label='Lighting preset'] .segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented[aria-label='Lighting preset'] .segment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    setLighting(button.dataset.light);
  });
});

// Section name input
sectionNameInput.addEventListener("input", () => {
  currentSection().name = sectionNameInput.value.trim() || "Untitled";
  updateSectionFields();
  renderSectionList();
  renderSectionPages();
});

sectionNameInput.addEventListener("change", () => saveSnapshot());

// All sections toggle
allSectionsToggle.addEventListener("change", () => {
  state.animateAllSections = allSectionsToggle.checked;
  updateStatus();
});

// Panel toggle
togglePanelsButton.addEventListener("click", () => {
  appShell.classList.toggle("panels-hidden");
  const hidden = appShell.classList.contains("panels-hidden");
  togglePanelsButton.classList.toggle("active", hidden);
  requestAnimationFrame(resize);
});

// Figma Grid Snap active state toggle
toggleGridBtn.addEventListener("click", () => {
  state.gridActive = !state.gridActive;
  layoutGridOverlay.hidden = !state.gridActive;
  toggleGridBtn.classList.toggle("active", state.gridActive);
  showToast(state.gridActive ? "Layout Grid enabled" : "Layout Grid disabled");
});

// Core action buttons
addSectionButton.addEventListener("click", addSectionAtEnd);
addTextButton.addEventListener("click", addTextLayer);
playButton.addEventListener("click", playPreview);
resetButton.addEventListener("click", resetDemo);
copyCodeButton.addEventListener("click", openCodeModal);
copyAgainButton.addEventListener("click", () => copyCode());
closeCodeButton.addEventListener("click", () => { codeModal.hidden = true; });
downloadHtmlBtn.addEventListener("click", downloadAsHtml);

codeModal.addEventListener("click", (event) => {
  if (event.target === codeModal) codeModal.hidden = true;
});

// Code export layout formats switcher
exportFormatSelector.querySelectorAll(".segment").forEach((btn) => {
  btn.addEventListener("click", () => {
    exportFormatSelector.querySelectorAll(".segment").forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    state.exportFormat = btn.dataset.format;
    generatedCode.textContent = generateCode();
  });
});

// Undo / Redo buttons
undoBtn.addEventListener("click", performUndo);
redoBtn.addEventListener("click", performRedo);

// Zoom buttons
zoomInBtn.addEventListener("click", zoomIn);
zoomOutBtn.addEventListener("click", zoomOut);
zoomResetBtn.addEventListener("click", zoomReset);

// Clear path
clearPathButton.addEventListener("click", () => {
  saveSnapshot();
  currentSection().pathPoints = [];
  state.assetPlaced = false;
  state.selectedPointIndex = 0;
  state.progress = 0;
  syncPointInspector();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  renderSectionList();
  renderSectionPages();
  showToast("Path cleared");
});

// Canvas interactions
overlay.addEventListener("click", addPathPoint);
assetHandle.addEventListener("pointerdown", startAssetDrag);
assetHandle.addEventListener("pointermove", dragAsset);
assetHandle.addEventListener("pointerup", stopDrag);
assetHandle.addEventListener("pointercancel", stopDrag);
assetHandle.addEventListener("wheel", nudgeAssetRotation, { passive: false });
websiteLayer.addEventListener("pointermove", dragText);
websiteLayer.addEventListener("pointerup", stopDrag);
websiteLayer.addEventListener("pointercancel", stopDrag);

// Timeline scrubber
scrubber.addEventListener("input", () => {
  state.progress = Number(scrubber.value);
  if (state.isPlaying) {
    state.isPlaying = false;
    syncPlayButton();
  }
  updateSceneFromState();
  updateScrubber();
});

timelinePlayBtn.addEventListener("click", playPreview);

loopToggle.addEventListener("change", () => {
  state.loopPlayback = loopToggle.checked;
});

// Easing select
easingSelect.addEventListener("change", () => {
  currentSection().easing = easingSelect.value;
  toggleBezierEditorVisibility();
  saveSnapshot();
});

// Duration input
durationInput.addEventListener("change", () => {
  currentSection().duration = clamp(Number(durationInput.value), 500, 10000);
  durationInput.value = currentSection().duration;
  updateScrubber();
  saveSnapshot();
});

// Section background color
sectionBgInput.addEventListener("input", () => {
  currentSection().bgColor = sectionBgInput.value;
  sectionBgHex.value = sectionBgInput.value;
  updateSceneFromState();
});

sectionBgInput.addEventListener("change", () => saveSnapshot());

sectionBgHex.addEventListener("change", () => {
  const hex = sectionBgHex.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    currentSection().bgColor = hex;
    sectionBgInput.value = hex;
    updateSceneFromState();
    saveSnapshot();
  }
});

// Text formatting controls
textKindSelect.addEventListener("change", () => {
  const item = findText(state.selectedTextId);
  if (!item) return;
  saveSnapshot();
  item.kind = textKindSelect.value;
  if (!item.color || item.color === "#b7c2d2" || item.color === "#f6f8fc" || item.color === "#4b5563" || item.color === "#111827") {
    item.color = item.kind === "body" ? "#4b5563" : "#111827";
    textColorInput.value = item.color;
    textColorHex.value = item.color;
  }
  renderWebsiteLayer();
  renderLayerList();
});

textSizeInput.addEventListener("change", () => {
  const item = findText(state.selectedTextId);
  if (!item) return;
  saveSnapshot();
  item.size = clamp(Number(textSizeInput.value), 10, 120);
  textSizeInput.value = item.size;
  renderWebsiteLayer();
});

textColorInput.addEventListener("input", () => {
  const item = findText(state.selectedTextId);
  if (!item) return;
  item.color = textColorInput.value;
  textColorHex.value = textColorInput.value;
  const node = websiteLayer.querySelector(`[data-id="${item.id}"]`);
  if (node) node.style.color = item.color;
});

textColorInput.addEventListener("change", () => saveSnapshot());

textColorHex.addEventListener("change", () => {
  const hex = textColorHex.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    const item = findText(state.selectedTextId);
    if (!item) return;
    item.color = hex;
    textColorInput.value = hex;
    const node = websiteLayer.querySelector(`[data-id="${item.id}"]`);
    if (node) node.style.color = hex;
    saveSnapshot();
  }
});

// Range sliders
depthInput.addEventListener("input", () => {
  state.pathDepth = Number(depthInput.value);
  const point = selectedPathPoint();
  if (point) {
    point.z = state.pathDepth;
    pointZInput.value = point.z;
  }
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
});

depthInput.addEventListener("change", () => saveSnapshot());

scaleInput.addEventListener("input", () => {
  state.scale = Number(scaleInput.value);
  updateSceneFromState();
});

scaleInput.addEventListener("change", () => saveSnapshot());

pointXInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.x = axisXToPoint(pointXInput.value);
  if (state.selectedPointIndex === 0) currentSection().modelPoint = point;
  setProgressToSelectedPoint();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
});

pointXInput.addEventListener("change", () => saveSnapshot());

pointYInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.y = axisYToPoint(pointYInput.value);
  if (state.selectedPointIndex === 0) currentSection().modelPoint = point;
  setProgressToSelectedPoint();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
});

pointYInput.addEventListener("change", () => saveSnapshot());

pointZInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.z = Number(pointZInput.value);
  state.pathDepth = point.z;
  depthInput.value = point.z;
  setProgressToSelectedPoint();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
});

pointZInput.addEventListener("change", () => saveSnapshot());

pointYawInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.yaw = Number(pointYawInput.value);
  drawSvgPath();
  updateSceneFromState();
});

pointYawInput.addEventListener("change", () => saveSnapshot());

pointPitchInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.pitch = Number(pointPitchInput.value);
  drawSvgPath();
  updateSceneFromState();
});

pointPitchInput.addEventListener("change", () => saveSnapshot());

pointRollInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.roll = Number(pointRollInput.value);
  drawSvgPath();
  updateSceneFromState();
});

pointRollInput.addEventListener("change", () => saveSnapshot());

cameraZInput.addEventListener("input", () => {
  state.cameraZ = Number(cameraZInput.value);
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
});

cameraZInput.addEventListener("change", () => saveSnapshot());

// Zoom via mouse wheel on stage
stageWrap.addEventListener("wheel", (e) => {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.92 : 1.08;
  setZoom(state.zoom * delta);
}, { passive: false });

// Middle-click pan on stage
stageWrap.addEventListener("pointerdown", (e) => {
  if (e.button === 1) {
    e.preventDefault();
    state.isPanning = true;
    state._panStart = { x: e.clientX, y: e.clientY, px: state.panX, py: state.panY };
    stageWrap.setPointerCapture(e.pointerId);
  }
});

stageWrap.addEventListener("pointermove", (e) => {
  if (!state.isPanning) return;
  const dx = e.clientX - state._panStart.x;
  const dy = e.clientY - state._panStart.y;
  state.panX = state._panStart.px + dx;
  state.panY = state._panStart.py + dy;
  stagePages.style.transform = `translate(${state.panX / state.zoom}px, ${state.panY / state.zoom}px)`;
});

stageWrap.addEventListener("pointerup", (e) => {
  if (state.isPanning) {
    state.isPanning = false;
    try { stageWrap.releasePointerCapture(e.pointerId); } catch {}
  }
});

// Context menu on canvas
viewportShell.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const items = [];
  if (state.activeTool === "path" && currentSection().pathPoints.length > 0) {
    items.push({ label: "Delete point", action: "delete-point", shortcut: "⌫", danger: true });
    items.push({ divider: true });
  }
  if (state.selectedTextId) {
    items.push({ label: "Duplicate text", action: "duplicate", shortcut: "⌘D" });
    items.push({ label: "Delete text", action: "delete-selected", shortcut: "⌫", danger: true });
    items.push({ divider: true });
  }
  items.push({ label: "Add text layer", action: "add-text", shortcut: "T" });
  items.push({ label: "Add path point", action: "add-point", shortcut: "P" });
  items.push({ label: "Clear path", action: "clear-path" });
  items.push({ divider: true });
  items.push({ label: "Zoom to fit", action: "zoom-fit", shortcut: "0" });

  showContextMenu(e.clientX, e.clientY, items);
});

// Close context menu
document.addEventListener("click", (e) => {
  if (!contextMenu.hidden && !contextMenu.contains(e.target)) {
    hideContextMenu();
  }
});

// Shortcuts modal
closeShortcutsBtn.addEventListener("click", () => { shortcutsModal.hidden = true; });
shortcutsModal.addEventListener("click", (e) => {
  if (e.target === shortcutsModal) shortcutsModal.hidden = true;
});

/* ===================================================
   Keyboard Shortcuts
   =================================================== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Shift") {
    isPositionModifierDown = true;
  }

  // Ignore when typing in inputs
  const tag = e.target.tagName;
  const isEditable = e.target.isContentEditable;
  const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

  // Always allow Escape
  if (e.key === "Escape") {
    if (!codeModal.hidden) { codeModal.hidden = true; return; }
    if (!shortcutsModal.hidden) { shortcutsModal.hidden = true; return; }
    if (!contextMenu.hidden) { hideContextMenu(); return; }
    state.selectedTextId = null;
    renderLayerList();
    markSelectedText();
    syncTextFormatPanel();
    return;
  }

  // Undo/Redo (always active)
  if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
    e.preventDefault();
    performUndo();
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
    e.preventDefault();
    performRedo();
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "Z") {
    e.preventDefault();
    performRedo();
    return;
  }

  // Don't hijack when user is typing text
  if (isInput || isEditable) return;

  // Duplicate
  if ((e.metaKey || e.ctrlKey) && e.key === "d") {
    e.preventDefault();
    duplicateSelected();
    return;
  }

  // Layout Grid Toggle (Ctrl+G)
  if ((e.metaKey || e.ctrlKey) && e.key === "g") {
    e.preventDefault();
    toggleGridBtn.click();
    return;
  }

  switch (e.key) {
    case "v":
    case "V":
      setTool("move");
      break;
    case "p":
    case "P":
      setTool("path");
      break;
    case "t":
    case "T":
      addTextLayer();
      break;
    case " ":
      e.preventDefault();
      playPreview();
      break;
    case "Delete":
    case "Backspace":
      deleteSelected();
      break;
    case "=":
    case "+":
      e.preventDefault();
      zoomIn();
      break;
    case "-":
    case "_":
      e.preventDefault();
      zoomOut();
      break;
    case "0":
      zoomReset();
      break;
    case "[":
      if (state.currentSectionIndex > 0) switchSection(state.currentSectionIndex - 1);
      break;
    case "]":
      if (state.currentSectionIndex < state.sections.length - 1) switchSection(state.currentSectionIndex + 1);
      break;
    case "?":
      shortcutsModal.hidden = !shortcutsModal.hidden;
      break;
    case "1": case "2": case "3": case "4":
    case "5": case "6": case "7": case "8": case "9":
      selectPathPoint(Number(e.key) - 1);
      break;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    isPositionModifierDown = false;
  }
});

window.addEventListener("blur", () => {
  isPositionModifierDown = false;
  assetHandle.classList.remove("rotation-dragging");
});

/* ===================================================
   Window Resize
   =================================================== */
window.addEventListener("resize", resize);

/* ===================================================
   Animation Loop
   =================================================== */
function animate(now) {
  updatePlayback(now);
  updateSceneFromState(now);

  // Sync and render viewport orientation gizmo
  const gizmoDir = new THREE.Vector3();
  camera.getWorldDirection(gizmoDir);
  gizmoCamera.position.copy(gizmoDir).multiplyScalar(-3.5);
  gizmoCamera.lookAt(0, 0, 0);
  gizmoRenderer.render(gizmoScene, gizmoCamera);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

/* ===================================================
   Initialization
   =================================================== */
initCollapsiblePanels();
renderAssetLibrary();
resize();
setLighting(state.light);
setTool("move");
switchSection(0);
saveSnapshot(); // initial snapshot for undo

requestAnimationFrame(animate);

// Show UI after Three.js first paint
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    loadingSkeleton.classList.add("hidden");
    appShell.classList.add("ready");
    setTimeout(() => loadingSkeleton.remove(), 600);
  });
});
