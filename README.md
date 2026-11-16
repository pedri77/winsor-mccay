# Winsor McCay: dibujar sueños

Web cinemática sobre Winsor McCay (h. 1867–1934): Little Nemo in Slumberland y Gertie the Dinosaur, con material de dominio público.

Demo: https://pedri77.github.io/winsor-mccay/

## Qué tiene

- Portada: un escenario de vodevil donde Gertie (1914) sale de su cueva fotograma a fotograma con el scroll.
- «La cama que camina» (26-7-1908): la página entera leída viñeta a viñeta con una cámara, traducción propia de los bocadillos y caída final de la cama.
- La última viñeta de 12 domingos (1905–1911), con visor de la página completa: zoom, arrastre y teclado.
- Gertie y el nacimiento de la animación.

## Derechos

McCay murió en 1934: su obra es de dominio público en España (vida + 80) y en la UE (vida + 70), y en EE. UU. todo lo publicado hasta 1930. Páginas, fotogramas y fotos proceden de Wikimedia Commons (dominio público). Se usan los escaneos de los periódicos originales, no restauraciones modernas. Traducciones y textos propios; textos y código hechos con IA (Claude) y revisados.

```bash
python3 -I scripts/explorar.py                                       # páginas y licencias
python3 -I scripts/descargar.py 1280 1908-07-26 …                    # miniaturas de Commons
uv run --with pillow python -I scripts/imagenes.py                   # WebP + recortes de viñetas
python3 -I scripts/secuencia.py gertie.webm public/gertie --n 120 --desde 560 --hasta 603 --ancho 960 --sin-movil
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3012
npm run lint && npm run build
```

React 19, Vite, Tailwind 4 y Lenis; un solo bucle `requestAnimationFrame`. Respeta `prefers-reduced-motion`. Despliegue a GitHub Pages con `.github/workflows/pages.yml` en cada push a `main`.
