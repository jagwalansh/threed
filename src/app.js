import * as THREE from "https://esm.sh/three@0.164.1";

const canvas = document.querySelector("#scene");
const appShell = document.querySelector(".app-shell");
const overlay = document.querySelector("#path-overlay");
const websiteLayer = document.querySelector("#website-layer");
const assetHandle = document.querySelector("#asset-handle");
const viewportShell = document.querySelector(".viewport-shell");
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

let idSeed = 1;

const createText = (text, x, y, size, kind = "headline") => ({
  id: `text-${idSeed++}`,
  kind,
  text,
  x,
  y,
  size,
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

const createSection = (name, pathPoints, texts) => ({
  id: `section-${idSeed++}`,
  name,
  modelPoint: normalizePathPoint(pathPoints[0] ?? createPathPoint(0.55, 0.52)),
  pathPoints: pathPoints.map(normalizePathPoint),
  texts,
});

function createDefaultSections() {
  idSeed = 1;
  return [
    createSection(
      "Hero",
      [
        createPathPoint(0.22, 0.68, -24, 8),
        createPathPoint(0.44, 0.36, 18, -4),
        createPathPoint(0.66, 0.54, 56, 0),
        createPathPoint(0.82, 0.24, 92, -12),
      ],
      [
        createText("Build 3D websites", 0.08, 0.18, 54),
        createText("Draw the motion. Export the code. Skip Three.js setup.", 0.09, 0.38, 20, "body"),
      ],
    ),
    createSection(
      "Features",
      [
        createPathPoint(0.74, 0.22, 124, -8),
        createPathPoint(0.52, 0.42, 48, 4),
        createPathPoint(0.38, 0.64, -12, 8),
        createPathPoint(0.18, 0.46, -60, -2),
      ],
      [
        createText("One asset, many sections", 0.12, 0.18, 42),
        createText("Use the same 3D model across multiple page sections.", 0.13, 0.33, 18, "body"),
      ],
    ),
  ];
}

const state = {
  asset: "rocket",
  light: "studio",
  activeTool: "move",
  isPlaying: false,
  playStartedAt: 0,
  playDuration: 3200,
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
};

const scene = new THREE.Scene();
scene.background = new THREE.Color("#11151b");

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

  return group;
}

function currentSection() {
  return state.sections[state.currentSectionIndex];
}

function setAsset(type) {
  state.asset = type;
  scene.remove(assetMesh);
  assetMesh.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
  });
  assetMesh = createAsset(type);
  scene.add(assetMesh);
  updateSceneFromState();
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

function updateSceneFromState() {
  drawingPlane.position.z = state.pathDepth;
  camera.position.z = state.cameraZ;
  camera.updateProjectionMatrix();

  const section = currentSection();
  assetMesh.position.copy(pointForSection(section, state.progress));
  assetMesh.scale.setScalar(state.scale);
  const facing = facingForSection(section, state.progress);
  assetMesh.rotation.set(
    THREE.MathUtils.degToRad(facing.pitch),
    THREE.MathUtils.degToRad(facing.yaw),
    THREE.MathUtils.degToRad(facing.roll),
  );

  const screen = worldToScreen(assetMesh.position);
  assetHandle.style.left = `${screen.x}px`;
  assetHandle.style.top = `${screen.y}px`;
  updateStatus();
}

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
      <path d="${pathData}" fill="none" stroke="rgba(49,196,141,0.22)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="${pathData}" fill="none" stroke="#31c48d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
      ${anchors}
    `
    : "";

  overlay.classList.toggle("drawing", state.activeTool === "path");
}

function renderWebsiteLayer() {
  const section = currentSection();
  websiteLayer.innerHTML = section.texts
    .map(
      (item) => `
        <div
          class="text-node ${item.id === state.selectedTextId ? "active" : ""}"
          contenteditable="true"
          spellcheck="false"
          data-id="${item.id}"
          data-kind="${item.kind}"
          style="left:${item.x * 100}%; top:${item.y * 100}%; font-size:${item.size}px;"
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
    });
  });
}

function markSelectedText() {
  websiteLayer.querySelectorAll(".text-node").forEach((node) => {
    node.classList.toggle("active", node.dataset.id === state.selectedTextId);
  });
}

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

function renderSectionList() {
  sectionList.innerHTML = state.sections
    .map(
      (section, index) => `
        <div class="section-row">
          <button class="section-item ${index === state.currentSectionIndex ? "active" : ""}" data-index="${index}" type="button">
            <span>${escapeHtml(section.name)}</span>
            <em>${section.pathPoints.length} pts</em>
          </button>
          <button class="section-insert" data-after="${index}" type="button" title="Add section after ${escapeHtml(section.name)}">Add section</button>
        </div>
      `,
    )
    .join("");

  sectionList.querySelectorAll(".section-item").forEach((button) => {
    button.addEventListener("click", () => switchSection(Number(button.dataset.index)));
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
          <span>${escapeHtml(item.text || "Text")}</span>
          <em>T</em>
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
    button.addEventListener("click", () => {
      state.selectedTextId = button.dataset.id ?? null;
      setTool("move");
      markSelectedText();
      renderLayerList();
    });
  });
}

function updateSectionFields() {
  const section = currentSection();
  sectionNameInput.value = section.name;
  sectionTitleLabel.textContent = section.name;
  canvasSectionName.textContent = section.name;
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
  renderLayerList();
  renderWebsiteLayer();
  syncPointInspector();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  syncPlayButton();
}

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
  if (state.activeTool === "path") {
    const total = currentSection().pathPoints.length;
    viewportStatus.textContent = total ? `Point ${state.selectedPointIndex + 1} of ${total}` : "Click to add point";
    return;
  }
  viewportStatus.textContent = state.selectedTextId ? "Text selected" : "Move mode";
}

function addPathPoint(event) {
  if (state.activeTool !== "path") return;
  const selectedAnchor = event.target.closest?.("[data-point-index]");
  if (selectedAnchor) {
    selectPathPoint(Number(selectedAnchor.dataset.pointIndex));
    return;
  }
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

function startAssetDrag(event) {
  if (state.activeTool !== "move") return;
  event.preventDefault();
  assetHandle.setPointerCapture(event.pointerId);
  state.drag = { type: "asset", pointerId: event.pointerId };
  moveModelTo(event.clientX, event.clientY);
}

function dragAsset(event) {
  if (!state.drag || state.drag.type !== "asset") return;
  moveModelTo(event.clientX, event.clientY);
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
  state.drag = null;
}

function startTextDrag(event) {
  const node = event.currentTarget;
  const item = findText(node.dataset.id);
  if (!item) return;
  state.selectedTextId = item.id;
  setTool("move");
  renderLayerList();
  markSelectedText();

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
  item.x = clamp((event.clientX - layerRect.left - state.drag.offsetX) / layerRect.width, 0, 0.92);
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

function addTextLayer() {
  const section = currentSection();
  const offset = section.texts.length * 0.055;
  const text = createText("New text", 0.14 + offset, 0.18 + offset, 36);
  section.texts.push(text);
  state.selectedTextId = text.id;
  setTool("move");
  renderWebsiteLayer();
  renderLayerList();
  const node = websiteLayer.querySelector(`[data-id="${text.id}"]`);
  if (node) {
    node.focus();
    document.getSelection()?.selectAllChildren(node);
  }
}

function addSection(afterIndex = state.sections.length - 1) {
  const index = state.sections.length + 1;
  const section = createSection(
    `Section ${index}`,
    [
      createPathPoint(0.24, 0.48, -20, 0),
      createPathPoint(0.5, 0.32, 18, -6),
      createPathPoint(0.76, 0.58, 64, 6),
    ],
    [
      createText(`Section ${index}`, 0.12, 0.2, 44),
      createText("Add page copy, then draw a path for this section.", 0.13, 0.35, 18, "body"),
    ],
  );
  state.sections.splice(afterIndex + 1, 0, section);
  switchSection(afterIndex + 1);
}

function addSectionAtEnd() {
  addSection(state.sections.length - 1);
}

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
  playButton.textContent = state.isPlaying ? "Pause" : "Play";
  playButton.classList.toggle("playing", state.isPlaying);
}

function updatePlayback(now) {
  if (!state.isPlaying) return;
  if (state.animateAllSections) {
    const totalDuration = state.playDuration * state.sections.length;
    const globalProgress = clamp((now - state.playStartedAt) / totalDuration, 0, 1);
    const scaled = globalProgress * state.sections.length;
    const nextIndex = Math.min(state.sections.length - 1, Math.floor(scaled));
    const localProgress = globalProgress === 1 ? 1 : scaled - nextIndex;
    if (nextIndex !== state.currentSectionIndex) {
      state.currentSectionIndex = nextIndex;
      state.selectedPointIndex = 0;
      updateSectionFields();
      renderSectionList();
      renderLayerList();
      renderWebsiteLayer();
      syncPointInspector();
      updatePathLine();
      drawSvgPath();
    }
    state.progress = localProgress;
    if (globalProgress >= 1) {
      state.isPlaying = false;
      syncPlayButton();
    }
    return;
  }

  state.progress = clamp((now - state.playStartedAt) / state.playDuration, 0, 1);
  if (state.progress >= 1) {
    state.isPlaying = false;
    syncPlayButton();
  }
}

function generateCode() {
  const exportedSections = state.animateAllSections ? state.sections : [currentSection()];
  const sceneData = {
    asset: state.asset,
    cameraZ: Number(state.cameraZ.toFixed(2)),
    scale: Number(state.scale.toFixed(2)),
    light: state.light,
    sections: exportedSections.map((section) => ({
      name: section.name,
      path: exportPointsForSection(section),
      texts: section.texts.map((item) => ({
        text: item.text,
        x: Number(item.x.toFixed(3)),
        y: Number(item.y.toFixed(3)),
        size: item.size,
        kind: item.kind,
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
mount.style.background = "#11151b";
mount.style.color = "#f4f6fb";
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

data.sections.forEach((section) => {
  const block = document.createElement("section");
  block.style.position = "relative";
  block.style.minHeight = "140vh";
  block.style.padding = "12vw 8vw";
  block.style.zIndex = "3";
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
    text.style.color = item.kind === "body" ? "#b7c2d2" : "#f4f6fb";
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
  const progress = Math.min(1, Math.max(0, -rect.top / max));
  const path = data.sections[activeIndex]?.path ?? data.sections[0].path;
  const curve = curveFor(path);
  const facing = facingFor(path, progress);
  asset.position.copy(curve.getPoint(progress));
  asset.rotation.set(
    THREE.MathUtils.degToRad(facing.pitch),
    THREE.MathUtils.degToRad(facing.yaw),
    THREE.MathUtils.degToRad(facing.roll)
  );
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
animate();
</script>`;
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
    copyStatus.textContent = "Copied to clipboard";
  } catch {
    copyStatus.textContent = "Code ready to copy";
  }
}

function resetDemo() {
  state.asset = "rocket";
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
  state.sections = createDefaultSections();

  allSectionsToggle.checked = false;
  depthInput.value = state.pathDepth;
  scaleInput.value = state.scale;
  cameraZInput.value = state.cameraZ;

  document.querySelectorAll(".asset-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.asset === state.asset);
  });
  document.querySelectorAll(".segment").forEach((button) => {
    button.classList.toggle("active", button.dataset.light === state.light);
  });

  setAsset(state.asset);
  setLighting(state.light);
  setTool("move");
  switchSection(0);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

document.querySelectorAll(".tool-button[data-tool]").forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

document.querySelectorAll(".asset-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".asset-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    setAsset(button.dataset.asset);
  });
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    setLighting(button.dataset.light);
  });
});

sectionNameInput.addEventListener("input", () => {
  currentSection().name = sectionNameInput.value.trim() || "Untitled";
  updateSectionFields();
  renderSectionList();
});

allSectionsToggle.addEventListener("change", () => {
  state.animateAllSections = allSectionsToggle.checked;
  updateStatus();
});

togglePanelsButton.addEventListener("click", () => {
  appShell.classList.toggle("panels-hidden");
  const hidden = appShell.classList.contains("panels-hidden");
  togglePanelsButton.textContent = hidden ? "Show panels" : "Panels";
  togglePanelsButton.classList.toggle("active", hidden);
  requestAnimationFrame(resize);
});

addSectionButton.addEventListener("click", addSectionAtEnd);
addTextButton.addEventListener("click", addTextLayer);
playButton.addEventListener("click", playPreview);
resetButton.addEventListener("click", resetDemo);
copyCodeButton.addEventListener("click", openCodeModal);
copyAgainButton.addEventListener("click", () => copyCode());
closeCodeButton.addEventListener("click", () => {
  codeModal.hidden = true;
});

codeModal.addEventListener("click", (event) => {
  if (event.target === codeModal) codeModal.hidden = true;
});

clearPathButton.addEventListener("click", () => {
  currentSection().pathPoints = [];
  state.selectedPointIndex = 0;
  state.progress = 0;
  syncPointInspector();
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
  renderSectionList();
});

overlay.addEventListener("click", addPathPoint);
assetHandle.addEventListener("pointerdown", startAssetDrag);
assetHandle.addEventListener("pointermove", dragAsset);
assetHandle.addEventListener("pointerup", stopDrag);
assetHandle.addEventListener("pointercancel", stopDrag);
websiteLayer.addEventListener("pointermove", dragText);
websiteLayer.addEventListener("pointerup", stopDrag);
websiteLayer.addEventListener("pointercancel", stopDrag);

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

scaleInput.addEventListener("input", () => {
  state.scale = Number(scaleInput.value);
  updateSceneFromState();
});

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

pointYawInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.yaw = Number(pointYawInput.value);
  drawSvgPath();
  updateSceneFromState();
});

pointPitchInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.pitch = Number(pointPitchInput.value);
  drawSvgPath();
  updateSceneFromState();
});

pointRollInput.addEventListener("input", () => {
  const point = selectedPathPoint();
  if (!point) return;
  point.roll = Number(pointRollInput.value);
  drawSvgPath();
  updateSceneFromState();
});

cameraZInput.addEventListener("input", () => {
  state.cameraZ = Number(cameraZInput.value);
  updatePathLine();
  drawSvgPath();
  updateSceneFromState();
});

window.addEventListener("resize", resize);

function animate(now) {
  updatePlayback(now);
  updateSceneFromState();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

resize();
setLighting(state.light);
setTool("move");
switchSection(0);
requestAnimationFrame(animate);
