#!/usr/bin/env python3
"""Vídeo → secuencia de fotos WebP para SecuenciaFijada y Triptico (patrones 12–14).

    python3 secuencia.py plano.mp4 public/secuencias/plano --n 120
    python3 secuencia.py plano.mp4 public/secuencias/plano --n 120 --desde 2.5 --hasta 9 --foco 0.62

Escribe <salida>/d/001.webp … (escritorio, 1600 px de ancho) y <salida>/m/001.webp … (móvil: recorte
vertical 9:16 centrado en --foco, 720 px de ancho). Fotos repartidas por igual entre --desde y --hasta.

Presupuesto: 120 fotos × ~45 KB = ~5 MB en escritorio. Más de 150 fotos rara vez se nota al hacer
scroll y sí en la descarga. Calidad 70 por defecto: el scrub esconde el grano, no los bloques.

Necesita ffmpeg y ffprobe; para WebP usa cwebp si está, si no Pillow. No toca la red.
"""

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def duracion(video: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)],
        check=True, capture_output=True, text=True,
    ).stdout
    return float(out.strip())


def a_webp(png: Path, webp: Path, calidad: int) -> None:
    if shutil.which("cwebp"):
        subprocess.run(["cwebp", "-quiet", "-q", str(calidad), str(png), "-o", str(webp)], check=True)
        return
    try:
        from PIL import Image
    except ImportError:
        sys.exit("Falta cwebp (paquete webp de Homebrew) o la librería Pillow de Python para escribir WebP.")
    Image.open(png).save(webp, "WEBP", quality=calidad)


def extraer(video: Path, t: float, filtro: str, destino: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.4f}", "-i", str(video), "-frames:v", "1", "-vf", filtro, str(destino)],
        check=True,
    )


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video", type=Path)
    ap.add_argument("salida", type=Path)
    ap.add_argument("--n", type=int, default=120)
    ap.add_argument("--desde", type=float, default=0.0)
    ap.add_argument("--hasta", type=float, default=None)
    ap.add_argument("--ancho", type=int, default=1600)
    ap.add_argument("--ancho-movil", type=int, default=720)
    ap.add_argument("--foco", type=float, default=0.5, help="x (0–1) que queda en el centro del recorte móvil")
    ap.add_argument("--calidad", type=int, default=70)
    ap.add_argument("--sin-movil", action="store_true")
    a = ap.parse_args()

    fin = a.hasta if a.hasta is not None else duracion(a.video) - 0.05
    if fin <= a.desde or a.n < 1:
        sys.exit("Tramo vacío: revisa --desde/--hasta/--n.")
    d = a.salida / "d"
    m = a.salida / "m"
    d.mkdir(parents=True, exist_ok=True)
    if not a.sin_movil:
        m.mkdir(parents=True, exist_ok=True)

    # recorte 9:16 a la altura completa, centrado en foco y sujeto a los bordes
    movil = (
        f"crop=ih*9/16:ih:max(0\\,min(iw-ih*9/16\\,iw*{a.foco}-ih*9/32)):0,"
        f"scale={a.ancho_movil}:-2:flags=lanczos"
    )
    escritorio = f"scale={a.ancho}:-2:flags=lanczos"
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "f.png"
        for i in range(a.n):
            t = a.desde + (fin - a.desde) * (i / max(1, a.n - 1))
            nombre = f"{i + 1:03d}.webp"
            extraer(a.video, t, escritorio, png)
            a_webp(png, d / nombre, a.calidad)
            if not a.sin_movil:
                extraer(a.video, t, movil, png)
                a_webp(png, m / nombre, a.calidad)
            print(f"\r{i + 1}/{a.n}", end="", flush=True)
    peso = sum(f.stat().st_size for f in d.glob("*.webp")) / 1e6
    print(f"\n{a.n} fotos → {d} ({peso:.1f} MB)" + ("" if a.sin_movil else f" y {m}"))
    if not a.sin_movil:
        # mismo cálculo que el filtro crop: ancho 9:16 de la altura, centrado en foco y sujeto a los bordes
        out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(a.video)],
                             check=True, capture_output=True, text=True).stdout.strip().split(",")
        w, h = float(out[0]), float(out[1])
        ancho = min(1.0, h * 9 / 16 / w)
        x0 = max(0.0, min(1 - ancho, a.foco - ancho / 2))
        print(f"recorteMovil={{[{x0:.4f}, {ancho:.4f}]}}  ← pásalo a SecuenciaFijada si usas anclas")


if __name__ == "__main__":
    main()
