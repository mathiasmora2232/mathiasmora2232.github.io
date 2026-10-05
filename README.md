# mathiasmora2232.github.io

Portfolio vivo de Mathias Mora, servido desde `docs/` con GitHub Pages.

## Estructura

- `docs/index.html`: entrada principal del portfolio.
- `docs/assets/`: estilos y JavaScript de presentacion.
- `docs/content/site-data.json`: bio, timeline, proyectos, experiencia, stack y notas.
- `docs/content/posts/`: notas en Markdown.
- `docs/content/projects/`: historias de proyectos en Markdown.
- `docs/archive/university-web/`: web universitaria anterior conservada como archivo.

## Editar contenido

Para cambiar la bio del inicio, edita `bio` dentro de `docs/content/site-data.json`.

La foto actual se toma del avatar publico de GitHub:

```json
"src": "https://github.com/mathiasmora2232.png"
```

Para usar una foto propia, guarda la imagen como `docs/assets/profile.jpg` y cambia la ruta a:

```json
"src": "./assets/profile.jpg"
```

Para agregar un hito o proyecto, edita `docs/content/site-data.json`.

Para agregar una nota:

1. Crea un archivo `.md` en `docs/content/posts/`.
2. Agrega una entrada en `notes` dentro de `site-data.json`.

El sitio no requiere build: es HTML, CSS y JavaScript estatico compatible con GitHub Pages.
