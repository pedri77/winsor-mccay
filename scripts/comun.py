"""Utilidades comunes: peticiones con caché, reintentos y User-Agent genérico.

"""
from __future__ import annotations

import hashlib
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = "mccay-pd-portfolio/0.1 (static site build; python-urllib)"
RAIZ = Path(__file__).resolve().parent.parent
CACHE = RAIZ / "datos-crudos" / "cache"
COMMONS = "https://commons.wikimedia.org/w/api.php"


def get_json(url: str, params: dict, pausa: float = 1.0) -> dict:
    url = f"{url}?{urllib.parse.urlencode(params)}"
    CACHE.mkdir(parents=True, exist_ok=True)
    fc = CACHE / (hashlib.sha1(url.encode()).hexdigest() + ".json")
    if fc.exists():
        return json.loads(fc.read_text())
    for intento in range(6):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                d = json.load(r)
            fc.write_text(json.dumps(d))
            time.sleep(pausa)
            return d
        except Exception as e:  # noqa: BLE001
            ra = getattr(e, "headers", None) and e.headers.get("Retry-After")
            espera = int(ra) if ra and ra.isdigit() else 15 * (intento + 1)
            print(f"  aviso {e!r}, reintento en {espera}s", file=sys.stderr)
            time.sleep(espera)
    raise RuntimeError(url)


