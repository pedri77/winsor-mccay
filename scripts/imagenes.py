"""Prepara las imágenes de la web desde Commons (todas de dominio público, comprobado en explorar.py).

- public/nemo/pagina.webp: la página de la cama que camina (26-7-1908), 1600 px de ancho.
- public/nemo/despertar/<fecha>.webp: la última viñeta de 12 domingos (cajas en scripts/ultimas.json).
- public/nemo/paginas/<fecha>.webp: esas 12 páginas enteras para el visor, 1280 px.
- public/extra/*.webp: retrato de McCay (1906) y dibujos originales de Gertie.
Escribe src/datos/imagenes.json. Uso: uv run --with pillow python -I scripts/imagenes.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comun import COMMONS, RAIZ, get_json  # noqa: E402
from descargar import bajar  # noqa: E402

PUB = RAIZ / "public"
EXTRA = {
    "retrato": "Winsor McCay 1906.jpg",
    "gertie-boca": "Gertie the Dinosaur with her mouth open (original art).jpg",
    "gertie-pilas": "Gertie stacks of drawings.jpg",
}


def licencia(fichero: str) -> tuple[str, int]:
    d = get_json(COMMONS, {"action": "query", "format": "json", "titles": "File:" + fichero, "prop": "imageinfo", "iiprop": "size|extmetadata",
                           "iiextmetadatafilter": "LicenseShortName"})
    ii = next(iter(d["query"]["pages"].values()))["imageinfo"][0]
    lic = ii["extmetadata"]["LicenseShortName"]["value"]
    if not lic.lower().startswith(("public domain", "cc0")):
        sys.exit(f"Licencia no válida: {fichero}: {lic}")
    return lic, ii["width"]


def webp(origen: Path, destino: Path, ancho: int, caja: list[float] | None = None, calidad: int = 78) -> tuple[int, int]:
    im = Image.open(origen).convert("RGB")
    if caja:
        W, H = im.size
        im = im.crop((int(caja[0] * W), int(caja[1] * H), int(caja[2] * W), int(caja[3] * H)))
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=calidad, method=6)
    return im.size


def main() -> None:
    paginas = {p["fecha"]: p for p in json.loads((RAIZ / "datos-crudos" / "paginas.json").read_text())}
    ultimas = json.loads((RAIZ / "scripts" / "ultimas.json").read_text())
    salida: dict = {"pagina": {}, "despertares": [], "extra": {}}

    p = paginas["1908-07-26"]
    licencia(p["fichero"])
    w, h = webp(RAIZ / "datos-crudos" / "paginas1920" / "1908-07-26.jpg", PUB / "nemo" / "pagina.webp", 1600, calidad=80)
    salida["pagina"] = {"fecha": "1908-07-26", "fichero": p["fichero"], "w": w, "h": h}

    for fecha, caja in ultimas.items():
        p = paginas[fecha]
        licencia(p["fichero"])
        origen = RAIZ / "datos-crudos" / "paginas1280" / f"{fecha}.jpg"
        dw, dh = webp(origen, PUB / "nemo" / "despertar" / f"{fecha}.webp", 640, caja)
        pw, ph = webp(origen, PUB / "nemo" / "paginas" / f"{fecha}.webp", 1280, calidad=74)
        salida["despertares"].append({"fecha": fecha, "fichero": p["fichero"], "w": dw, "h": dh, "pw": pw, "ph": ph})

    for id_, fichero in EXTRA.items():
        _, ancho = licencia(fichero)
        origen = RAIZ / "datos-crudos" / "extra" / f"{id_}.jpg"
        origen.parent.mkdir(parents=True, exist_ok=True)
        bajar(fichero, origen, min(1280, ancho))
        w, h = webp(origen, PUB / "extra" / f"{id_}.webp", 1280)
        salida["extra"][id_] = {"fichero": fichero, "w": w, "h": h}

    destino = RAIZ / "src" / "datos" / "imagenes.json"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(salida, ensure_ascii=False, indent=1))
    print("ok", len(salida["despertares"]), "despertares")


if __name__ == "__main__":
    main()
