// Navegación entre "pines" (Home / Redes / Portafolio)
const pins = document.querySelectorAll(".pin");
const views = document.querySelectorAll(".view");

function activate(targetId){
  views.forEach(v => v.classList.toggle("view--active", v.id === targetId));
  pins.forEach(p => {
    const isCurrent = p.dataset.target === targetId;
    p.toggleAttribute("aria-current", isCurrent);
    if (isCurrent) p.setAttribute("aria-current", "page");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", "#" + targetId);

  // recalcula los collages al mostrar la vista (estaban ocultos con display:none,
  // así que su ancho real recién se conoce ahora)
  if (targetId === "portafolio"){
    requestAnimationFrame(() => {
      document.querySelectorAll("#portafolio .project__collage").forEach(layoutCollage);
    });
  }
}

pins.forEach(pin => {
  pin.addEventListener("click", () => activate(pin.dataset.target));
});

// Soporta abrir directo en #redes o #portafolio
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById(hash)) activate(hash);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ================================================================
// Collages dinámicos de portafolio (masonry por tamaño real de imagen)
// ================================================================
const COLLAGE_EXTS = ["jpg", "jpeg", "png", "webp"];
const ROW_H = 8;   // debe coincidir con grid-auto-rows en style.css
const GAP   = 6;   // debe coincidir con gap en style.css

// intenta cargar UNA imagen; resuelve con el <img> si existe, o null si no
function tryLoadImage(src){
  return new Promise(resolve => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// para el índice n, prueba las extensiones conocidas y devuelve la primera que exista
async function findImageAt(folder, n){
  for (const ext of COLLAGE_EXTS){
    const img = await tryLoadImage(`${folder}${n}.${ext}`);
    if (img) return img;
  }
  return null;
}

// recorre 1, 2, 3… hasta que un índice no tenga ninguna extensión válida
async function discoverImages(folder, max){
  const found = [];
  for (let n = 1; n <= max; n++){
    const img = await findImageAt(folder, n);
    if (!img) break;
    found.push(img);
  }
  return found;
}

// calcula cuántas "filas" (grid-auto-rows) debe ocupar cada imagen
// según su proporción real y el ancho de columna disponible
function layoutCollage(container){
  const cols = parseInt(getComputedStyle(container).getPropertyValue("--collage-cols")) || 3;
  const colWidth = (container.clientWidth - GAP * (cols - 1)) / cols;

  container.querySelectorAll(".collage-item").forEach(item => {
    const img = item.querySelector("img");
    if (!img || !img.naturalWidth) return;
    const scaledHeight = colWidth * (img.naturalHeight / img.naturalWidth);
    const span = Math.ceil((scaledHeight + GAP) / (ROW_H + GAP));
    item.style.gridRowEnd = `span ${span}`;
  });
}

async function initCollage(container){
  const folder = container.dataset.folder;
  const max = parseInt(container.dataset.max) || 24;
  if (!folder) return;

  const images = await discoverImages(folder, max);

  if (images.length === 0){
    container.innerHTML = `<div class="collage-empty">Sin fotos todavía — agrega
      ${folder}1.jpg, ${folder}2.jpg, … (jpg/jpeg/png/webp)</div>`;
    return;
  }

  container.innerHTML = "";
  images.forEach((img, i) => {
    const item = document.createElement("div");
    item.className = "collage-item";
    img.alt = `${folder.replace(/[./]/g, "")} — foto ${i + 1}`;
    img.loading = "lazy";

    const link = document.createElement("a");
    link.href = img.src;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `Ver foto ${i + 1} en tamaño completo`);
    link.appendChild(img);

    item.appendChild(link);
    container.appendChild(item);
  });

  layoutCollage(container);
}

function initAllCollages(){
  document.querySelectorAll(".project__collage").forEach(initCollage);
}

// recalcula el layout al cambiar tamaño de ventana (debounced)
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.querySelectorAll(".project__collage").forEach(layoutCollage);
  }, 150);
});

initAllCollages();

// Toggle modo light / dark
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function setTheme(theme){
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggle.setAttribute("aria-pressed", theme === "light");
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Cambiar a modo light" : "Cambiar a modo dark"
  );
}

if (themeToggle){
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
  // sincroniza el estado inicial del botón con el tema ya aplicado en <head>
  setTheme(root.getAttribute("data-theme"));
}
