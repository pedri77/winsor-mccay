"""Descarga páginas de Little Nemo (miniatura estándar de Commons) a datos-crudos/paginas/<fecha>.jpg.

Uso: python3 -I scripts/descargar.py 1280 1905-10-15 1908-07-26 …   (o «muestra N» para N repartidas)
"""
from __future__ import annotations

import json
import sys
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comun import COMMONS, RAIZ, UA, get_json  # noqa: E402


def bajar(fichero: str, destino: Path, ancho: int) -> None:
    if destino.exists():
        return
    d = get_json(COMMONS, {"action": "query", "format": "json", "titles": "File:" + fichero, "prop": "imageinfo", "iiprop": "url", "iiurlwidth": ancho})
    ii = next(iter(d["query"]["pages"].values()))["imageinfo"][0]
    url = (ii.get("thumburl") or ii["url"]).split("?")[0]
    for intento in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                destino.write_bytes(r.read())
            time.sleep(1.5)
            return
        except Exception as e:  # noqa: BLE001
            ra = getattr(e, "headers", None) and e.headers.get("Retry-After")
            espera = int(ra) if ra and ra.isdigit() else 20 * (intento + 1)
            print(f"  aviso {fichero}: {e!r}, reintento en {espera}s", file=sys.stderr)
            time.sleep(espera)
    raise RuntimeError(url)


def main() -> None:
    ancho = int(sys.argv[1])
    paginas = json.loads((RAIZ / "datos-crudos" / "paginas.json").read_text())
    por_fecha = {p["fecha"]: p for p in paginas}
    if sys.argv[2] == "muestra":
        n = int(sys.argv[3])
        fechas = [paginas[round(i * (len(paginas) - 1) / (n - 1))]["fecha"] for i in range(n)]
    else:
        fechas = sys.argv[2:]
    carpeta = RAIZ / "datos-crudos" / f"paginas{ancho}"
    carpeta.mkdir(parents=True, exist_ok=True)
    for f in fechas:
        p = por_fecha[f]
        w = ancho if p["ancho"] >= ancho else p["ancho"]
        bajar(p["fichero"], carpeta / f"{f}.jpg", w)
        print(f, end=" ", flush=True)
    print()


if __name__ == "__main__":
    main()
