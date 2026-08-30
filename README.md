# Alan Samuel Gomez Paz — CV Website

Sitio web personal que funciona como CV interactivo, con tres secciones (Home, Social Networks, Portafolio) navegables sin recargar la página, modo claro/oscuro, y un portafolio con collages de fotos que se generan automáticamente y se pueden filtrar por tecnología.

## Estructura

```
.
├── index.html
├── style.css
├── script.js
├── CV.pdf              ← agrégalo tú (botón "Descargar CV" apunta aquí)
├── Proyecto_1/          ← fotos del proyecto 1 (1.jpg, 2.jpg, 3.png, …)
├── Proyecto_3/
├── Proyecto_6/
└── README.md
```

## Cómo agregar fotos a un proyecto

Dentro de la carpeta correspondiente (`./Proyecto_N/`), numera las imágenes empezando en `1`, sin saltos: `1.jpg`, `2.jpg`, `3.png`… Acepta `.jpg`, `.jpeg`, `.png` y `.webp` mezclados. El collage arma un layout tipo masonry automáticamente según el tamaño real de cada foto — no hay que configurar nada más.

## Cómo agregar un proyecto nuevo al Portafolio

1. Copia el bloque `<article class="project" data-tags="...">…</article>` de un proyecto existente.
2. Ponle sus propias etiquetas en `data-tags` (separadas por espacio), por ejemplo `data-tags="python docker security"`.
3. Si usas una etiqueta que no existe todavía, agrégale una entrada en `TAG_LABELS` dentro de `script.js` para controlar cómo se muestra el nombre del filtro (opcional — si no la agregas, se capitaliza automáticamente).
4. El botón de filtro correspondiente aparece solo, sin tocar nada más.

Para un proyecto sin fotos (solo texto), usa la clase `project--text-only` y omite el `.project__collage`.

## Cómo cambiar el CV descargable

Reemplaza el archivo `CV.pdf` en la raíz del proyecto — el nombre debe coincidir exactamente (`CV.pdf`) para que el botón de descarga en Home funcione.

## Uso

No requiere build ni servidor: abre `index.html` directamente en el navegador, o súbelo tal cual a cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.).

## Acknowledgments

This project was developed with assistance from Claude, Anthropic's AI assistant.
