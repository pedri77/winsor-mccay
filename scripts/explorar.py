"""Lista las páginas dominicales de Little Nemo en Commons (1905–1911) con licencia y tamaño.

Escribe datos-crudos/paginas.json. Uso: python3 -I scripts/explorar.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from comun import COMMONS, RAIZ, get_json  # noqa: E402

FECHA = re.compile(r"^Little Nemo (\d{4}-\d{2}-\d{2})\.jpg$")


def main() -> None:
    ficheros = []
    for anio in range(1905, 1912):
        d = get_json(COMMONS, {"action": "query", "format": "json", "list": "categorymembers", "cmtype": "file", "cmlimit": 500,
                               "cmtitle": f"Category:Little Nemo in Slumberland, {anio}"})
        ficheros += [m["title"][5:] for m in d["query"]["categorymembers"] if FECHA.match(m["title"][5:])]
    salida = []
    for i in range(0, len(ficheros), 40):
        lote = ficheros[i:i + 40]
        d = get_json(COMMONS, {"action": "query", "format": "json", "titles": "|".join("File:" + f for f in lote), "prop": "imageinfo",
                               "iiprop": "size|extmetadata", "iiextmetadatafilter": "LicenseShortName"})
        for p in d["query"]["pages"].values():
            ii = (p.get("imageinfo") or [{}])[0]
            f = p["title"][5:]
            salida.append({"fichero": f, "fecha": FECHA.match(f)[1], "ancho": ii.get("width"), "alto": ii.get("height"),
                           "licencia": ii.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "")})
    salida.sort(key=lambda x: x["fecha"])
    (RAIZ / "datos-crudos" / "paginas.json").write_text(json.dumps(salida, ensure_ascii=False, indent=1))
    lic = {}
    for s in salida:
        lic[s["licencia"]] = lic.get(s["licencia"], 0) + 1
    print(len(salida), "páginas", lic)
    print("anchos", sorted({s["ancho"] for s in salida})[:5], "…", max(s["ancho"] for s in salida))


if __name__ == "__main__":
    main()
