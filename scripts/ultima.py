"""Caja de la última viñeta (abajo a la derecha) de una página: busca la calle vertical y la horizontal
más cercanas a la esquina inferior derecha. Calle = columna o fila casi toda clara respecto al papel.
Uso: uv run --with pillow python -I scripts/ultima.py <imagen>  →  [x0, y0, x1, y1] normalizado
"""
from __future__ import annotations

import json
import sys

from PIL import Image


def caja(ruta: str) -> list[float]:
    im = Image.open(ruta).convert("L")
    w, h = im.size
    im = im.resize((w // 2, h // 2))
    W, H = im.size
    d = im.load()
    vals = sorted(d[x, y] for x in range(0, W, 3) for y in range(0, H, 3))
    papel = vals[int(len(vals) * 0.97)]
    claro = lambda v: v > papel - 28  # noqa: E731
    # Calle vertical: buscando hacia la izquierda desde el 92 % del ancho, en el 25 % inferior de la página.
    y_a, y_b = int(H * 0.78), int(H * 0.97)
    x0 = 0
    for x in range(int(W * 0.92), int(W * 0.2), -1):
        if sum(claro(d[x, y]) for y in range(y_a, y_b)) / (y_b - y_a) > 0.93:
            x0 = x
            break
    # Calle horizontal: buscando hacia arriba desde el 95 % del alto, entre x0 y el borde derecho.
    y0 = 0
    xa, xb = x0 + 4, int(W * 0.97)
    for y in range(int(H * 0.95), int(H * 0.4), -1):
        if sum(claro(d[x, y]) for x in range(xa, xb)) / max(1, xb - xa) > 0.93:
            y0 = y
            break
    return [round(x0 / W, 4), round(y0 / H, 4), 0.995, 0.99]


if __name__ == "__main__":
    print(json.dumps(caja(sys.argv[1])))
