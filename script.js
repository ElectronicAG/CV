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
