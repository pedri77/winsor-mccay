import {useEffect, useRef} from 'react';
import {GERTIE_N, gertieBase, portada} from '../content';
import {useMovimientoReducido} from '../hooks/useMovimientoReducido';
import {easeOutCubic, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';
import {ajustarLienzo, cargarSecuencia} from '../lib/secuencia';

/**
 * Portada: un escenario de vodevil bajo el cielo nocturno. Se abre el telón y en la pantalla Gertie
 * sale de su cueva fotograma a fotograma con el scroll (patrón 12: 120 WebP de la película de 1914,
 * pintados en canvas con «contain»: el 4:3 original no se recorta).
 *
 * Guion de scroll (p), sección de 460 svh:
 *   0.00 – 0.10  el telón se abre (cada mitad sale hacia su lado, easeOutCubic); la invitación se apaga
 *   0.04 – 0.96  foto = p reescalado a 0…119
 *   0.16 – 0.28  el titular se apaga y sube
 *   capítulos    cada uno en su tramo, con fundido de 0.03
 *   0.96 – 1.00  último fotograma quieto hasta soltarse
 */

const ALTO_VH = 460;

export function Portada() {
  const raizRef = useRef<HTMLElement>(null);
  const lienzoRef = useRef<HTMLCanvasElement>(null);
  const telonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tituloRef = useRef<HTMLDivElement>(null);
  const invitaRef = useRef<HTMLParagraphElement>(null);
  const capRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const reducido = useMovimientoReducido();
  const reducidoRef = useRef(reducido);
  reducidoRef.current = reducido;

  useEffect(() => {
    const sec = cargarSecuencia(gertieBase, GERTIE_N);
    const lienzo = lienzoRef.current!;
    const ctx = lienzo.getContext('2d')!;
    let pintada = '';
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible) return;

      const i = Math.round(tramo(p, 0.04, 0.96) * (GERTIE_N - 1));
      const img = sec.foto(i);
      const dpr = ajustarLienzo(lienzo);
      const clave = `${img?.src}|${lienzo.width}x${lienzo.height}`;
      if (img && clave !== pintada) {
        ctx.fillStyle = '#e9e6dc';
        ctx.fillRect(0, 0, lienzo.width, lienzo.height);
        const escala = Math.min(lienzo.width / img.naturalWidth, lienzo.height / img.naturalHeight);
        const w = img.naturalWidth * escala;
        const h = img.naturalHeight * escala;
        ctx.drawImage(img, (lienzo.width - w) / 2, (lienzo.height - h) / 2, w, h);
        pintada = clave;
        void dpr;
      }
      if (Math.abs(p - pAnterior) < 0.00005) return;
      pAnterior = p;

      const abre = reducidoRef.current ? 1 : easeOutCubic(tramo(p, 0, 0.1));
      telonRefs.current.forEach((t, k) => {
        if (t) t.style.transform = `translate3d(${(k === 0 ? -1 : 1) * abre * 100}%, 0, 0)`;
      });
      invitaRef.current!.style.opacity = String(1 - tramo(p, 0, 0.05));
      const t = tramo(p, 0.16, 0.28);
      tituloRef.current!.style.opacity = String(1 - t);
      tituloRef.current!.style.transform = `translate3d(0, ${-t * 4}vh, 0)`;
      portada.capitulos.forEach((c, k) => {
        const el = capRefs.current[k];
        if (el) el.style.opacity = String(Math.min(tramo(p, c.desde, c.desde + 0.03), 1 - tramo(p, c.hasta - 0.03, c.hasta)));
      });
    });
  }, []);

  return (
    <section ref={raizRef} id="inicio" aria-labelledby="portada-titulo" className="relative" style={{height: `${ALTO_VH}svh`}}>
      <div className="cielo sticky top-0 h-pantalla overflow-hidden">
        <div className="mx-auto grid h-full max-w-[96rem] grid-rows-[auto_1fr] items-center gap-4 px-4 pt-[7svh] pb-[8svh] sm:px-6 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:grid-rows-1 md:gap-[3vw] md:px-[4vw] md:py-[8svh]">
          <div ref={tituloRef} className="relative z-10">
            <p className="rotulo text-etiqueta text-amarillo">{portada.antetitulo}</p>
            <h1 id="portada-titulo" className="mt-3 font-display text-hero text-texto">
              {portada.titulo}
            </h1>
            <p className="mt-4 max-w-[26rem] text-body text-texto-2 md:text-lead">{portada.bajada}</p>
          </div>

          {/* Escenario: arco, pantalla 4:3 y telón */}
          <figure className="relative mx-auto w-full max-w-[min(100%,calc((100svh-18rem)*4/3))] md:max-w-[min(100%,calc(84svh*4/3))]">
            <div className="relative rounded-t-[50%_14%] bg-rojo-profundo p-[3%] pt-[6%] shadow-[0_30px_80px_-30px_oklch(5%_0.05_275)]">
              <div className="pointer-events-none absolute inset-[1.2%] rounded-t-[50%_14%] border-2 border-amarillo/70" aria-hidden="true" />
              <div className="grano-cine relative aspect-[4/3] overflow-hidden bg-[#e9e6dc]">
                <canvas ref={lienzoRef} className="block size-full" role="img" aria-label={portada.etiqueta} />
                {[0, 1].map((k) => (
                  <div
                    key={k}
                    ref={(el) => {
                      telonRefs.current[k] = el;
                    }}
                    className={`absolute inset-y-0 w-1/2 bg-[repeating-linear-gradient(90deg,var(--color-rojo-profundo)_0_14px,var(--color-rojo)_14px_30px)] shadow-[inset_0_-40px_40px_-20px_oklch(15%_0.05_30)] ${k === 0 ? 'left-0' : 'right-0'}`}
                    aria-hidden="true"
                  />
                ))}
                {portada.capitulos.map((c, k) => (
                  <p
                    key={k}
                    ref={(el) => {
                      capRefs.current[k] = el;
                    }}
                    className="absolute inset-x-[4%] bottom-[5%] bg-void/90 px-4 py-3 text-[clamp(0.9375rem,1.2vw,1.125rem)] leading-snug text-texto"
                    style={{opacity: 0}}
                  >
                    {c.texto}
                  </p>
                ))}
              </div>
            </div>
            <figcaption className="mt-2 text-center text-[0.8125rem] text-texto-3 italic">{portada.pie}</figcaption>
          </figure>
        </div>
        <p ref={invitaRef} className="rotulo absolute bottom-[2.5svh] left-1/2 -translate-x-1/2 text-[0.6875rem] whitespace-nowrap text-amarillo">
          {portada.invitacion} ↓
        </p>
      </div>
    </section>
  );
}
