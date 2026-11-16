"""Detecta las viñetas de una página de Little Nemo buscando los blancos de separación (calles).

Primero filas (bandas horizontales claras de lado a lado), luego columnas dentro de cada fila.
Devuelve cajas normalizadas (0–1) en orden de lectura. Uso: uv run --with pillow python -I scripts/vinetas.py <imagen>
"""
from __future__ import annotations

import json
import sys

from PIL import Image


def bandas(perfil: list[float], umbral: float, minimo: int) -> list[tuple[int, int]]:
    """Tramos donde el perfil NO es calle (contenido), descartando los muy cortos."""
    tramos, ini = [], None
    for i, v in enumerate(perfil + [1.0]):
        contenido = v < umbral
        if contenido and ini is None:
            ini = i
        elif not contenido and ini is not None:
            if i - ini >= minimo:
                tramos.append((ini, i))
            ini = None
    return tramos


def claro(px: tuple[int, int, int]) -> bool:
    r, g, b = px
    return min(r, g, b) > 200 and max(r, g, b) - min(r, g, b) < 60


def vinetas(ruta: str) -> list[list[float]]:
    im = Image.open(ruta).convert("RGB")
    w, h = im.size
    peq = im.resize((w // 2, h // 2))
    W, H = peq.size
    d = peq.load()
    filas = [sum(claro(d[x, y]) for x in range(W)) / W for y in range(H)]
    cajas = []
    for y0, y1 in bandas(filas, 0.9, H // 40):
        cols = [sum(claro(d[x, y]) for y in range(y0, y1)) / (y1 - y0) for x in range(W)]
        for x0, x1 in bandas(cols, 0.9, W // 30):
            cajas.append([round(x0 / W, 4), round(y0 / H, 4), round(x1 / W, 4), round(y1 / H, 4)])
    return cajas


if __name__ == "__main__":
    print(json.dumps(vinetas(sys.argv[1])))
