# My Book Journal 📚

Proyecto inicial de una aplicación de biblioteca personal y seguimiento de lecturas.

## Estado actual

**Etapa 1: visor de diseños de Stitch.** Se incluye una aplicación React + TypeScript + Vite con navegación entre las cuatro pantallas principales y tres variantes. Las pantallas se muestran como HTML original de Stitch en un iframe; **todavía no son componentes React funcionales** y no existe una base de datos conectada.

## Requisitos

Node.js 20.19+ o 22.12+ y npm.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir la dirección local indicada por Vite (normalmente http://localhost:5173).

## Publicar en GitHub

Crear un repositorio vacío privado y subir el contenido de esta carpeta (no la carpeta contenedora). Puede hacerse desde GitHub mediante **Add file → Upload files** o mediante Git.

## Estructura

- `src/`: aplicación React inicial y estilos del visor.
- `public/stitch/`: código HTML y capturas originales de las siete pantallas exportadas.
- `docs/DESIGN.md`: sistema visual exportado de Stitch.

## Próximas etapas

1. Convertir pantallas HTML en componentes React reales y conectados.
2. Crear modelo de datos: títulos, ediciones, ejemplares, lecturas y sesiones.
3. Implementar búsqueda por ISBN/título/autor.
4. Integrar autenticación, Firestore y reglas de seguridad.
5. Incorporar calendario con portadas de libros terminados, rachas y biblioteca de lomos.

**Nota:** las pantallas originales pueden depender de recursos externos (fuentes, imágenes y Tailwind CDN) y su vista previa requiere conexión. No colocar secretos en el repositorio.
