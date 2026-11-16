import {useEffect, useRef} from 'react';
import {IMG, paginaUrl, slumberland} from '../content';
import {easeInOutSine, easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Una noche en Slumberland: la página del 26-7-1908 entera y, con el scroll, una cámara que va de
 * viñeta en viñeta. Las viñetas aún no leídas quedan a oscuras; debajo, la traducción de la que toca.
 * Al final la página se inclina y cae, como Nemo de la cama, y aparece «¡Era un sueño!».
 *
 * Guion de scroll (p), sección de 38 svh por parada:
 *   0.02 – 0.90  paradas 0 … 16 (0 = página entera): reposo el 40 % inicial de cada tramo y viaje
 *               con easeInOutSine; zoom interpolado en logaritmo
 *   oscuro      viñeta k > actual: 0.78; las leídas, 0; transición en el viaje
 *   0.91 – 0.98  la página gira −14°, cae 60 vh y se apaga (easeInCubic implícito con t²)
 *   0.93 – 1.00  entra «¡Era un sueño!»
 */

const V = slumberland.vinetas;
const PARADAS = V.length; // 16; parada 0 = página entera
const ALTO_VH = 38 * (PARADAS + 1) + 160;
const ASPECTO = IMG.pagina.w / IMG.pagina.h;
const FIN = 0.9;

export function Slumberland() {
  const raizRef = useRef<HTMLElement>(null);
  const capaRef = useRef<HTMLDivElement>(null);
  const caidaRef = useRef<HTMLDivElement>(null);
  const oscuroRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textoRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const pieRef = useRef<HTMLDivElement>(null);
  const entradaRef = useRef<HTMLDivElement>(null);
  const suenoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    let anchoAnterior = 0;
    let textoVisible = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (!visible || (Math.abs(p - pAnterior) < 0.00005 && vw === anchoAnterior)) return;
      pAnterior = p;
      anchoAnterior = vw;

      // Página encajada a zoom 1.
      let h = vh * 0.9;
      let w = h * ASPECTO;
      if (w > vw * 0.92) {
        w = vw * 0.92;
        h = w / ASPECTO;
      }
      // Hueco disponible para la viñeta (deja sitio abajo para el texto).
      const huecoW = vw * 0.9;
      const huecoH = vh * (vw < 768 ? 0.6 : 0.66);
      const centroY = vh * (vw < 768 ? 0.4 : 0.42);
      const parada = (k: number) => {
        if (k === 0) return {z: 1, fx: 0.5, fy: 0.5, cx: vw < 768 ? vw / 2 : vw * 0.64, cy: vh / 2};
        const [x0, y0, x1, y1] = V[k - 1].caja;
        const z = Math.min(huecoW / ((x1 - x0) * w), huecoH / ((y1 - y0) * h));
        return {z, fx: (x0 + x1) / 2, fy: (y0 + y1) / 2, cx: vw / 2, cy: centroY};
      };

      const q = tramo(p, 0.02, FIN) * PARADAS;
      const j = Math.min(PARADAS - 1, Math.floor(q));
      const u = q - j;
      const s = easeInOutSine(tramo(u, 0.4, 1));
      const a = parada(j);
      const b = parada(j + 1);
      const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), s));
      const fx = lerp(a.fx, b.fx, s);
      const fy = lerp(a.fy, b.fy, s);
      const cx = lerp(a.cx, b.cx, s);
      const cy = lerp(a.cy, b.cy, s);
      const capa = capaRef.current!;
      capa.style.width = `${w}px`;
      capa.style.height = `${h}px`;
      capa.style.transform = `translate3d(${cx - fx * w * z}px, ${cy - fy * h * z}px, 0) scale(${z})`;

      // Viñeta «actual» continua: j + s (entre la que se deja y la que llega).
      const actual = j + s;
      oscuroRefs.current.forEach((o, k) => {
        // En la vista de la página entera no se oscurece nada; la sombra entra al ir a la viñeta 1.
        if (o) o.style.opacity = String(0.78 * tramo(k + 1 - actual, 0, 1) * tramo(actual, 0, 1));
      });

      const conTexto = Math.round(actual);
      if (conTexto !== textoVisible) {
        textoRefs.current.forEach((t, k) => {
          if (t) t.style.display = k + 1 === conTexto ? '' : 'none';
        });
        textoVisible = conTexto;
      }
      // El texto se apaga a mitad de viaje (cuando cambia) y vuelve al llegar: |2s − 1|.
      pieRef.current!.style.opacity = String(conTexto === 0 ? 0 : Math.abs(2 * s - 1) * (1 - tramo(p, 0.9, 0.93)));
      entradaRef.current!.style.opacity = String(j === 0 ? 1 - tramo(u, 0.3, 0.5) : 0);

      const c = tramo(p, 0.91, 0.98);
      const caida = caidaRef.current!;
      caida.style.transform = `translate3d(0, ${c * c * 60}vh, 0) rotate(${-14 * easeOutCubic(c)}deg)`;
      caida.style.opacity = String(1 - tramo(p, 0.93, 0.98));
      suenoRef.current!.style.opacity = String(tramo(p, 0.93, 0.99));
      suenoRef.current!.style.transform = `scale(${lerp(0.85, 1, easeOutCubic(tramo(p, 0.93, 0.99)))})`;
    });
  }, []);

  return (
    <section ref={raizRef} id="slumberland" aria-labelledby="slumberland-titulo" className="relative" style={{height: `${ALTO_VH}svh`}}>
      <ol className="sr-only">
        {V.map((v, k) => (
          <li key={k}>
            Viñeta {k + 1}: {v.texto}
          </li>
        ))}
      </ol>
      <div className="cielo sticky top-0 h-pantalla overflow-hidden">
        <div ref={caidaRef} className="absolute inset-0 origin-[50%_80%]">
          <div ref={capaRef} className="absolute top-0 left-0 origin-top-left will-change-transform">
            <img src={paginaUrl} alt={slumberland.etiqueta} width={IMG.pagina.w} height={IMG.pagina.h} loading="lazy" decoding="async" className="block size-full shadow-[0_20px_60px_oklch(5%_0.05_275)]" />
            {V.map((v, k) => (
              <div
                key={k}
                ref={(el) => {
                  oscuroRefs.current[k] = el;
                }}
                className="absolute bg-void"
                style={{left: `${v.caja[0] * 100}%`, top: `${v.caja[1] * 100}%`, width: `${(v.caja[2] - v.caja[0]) * 100}%`, height: `${(v.caja[3] - v.caja[1]) * 100}%`, opacity: 0}}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div ref={entradaRef} className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,oklch(18%_0.07_275/0.95)_60%,transparent)] px-4 pt-24 pb-[5svh] sm:px-6 md:inset-x-auto md:top-0 md:left-0 md:flex md:w-[34vw] md:flex-col md:justify-center md:bg-[linear-gradient(to_right,oklch(18%_0.07_275/0.95)_60%,transparent)] md:px-[4vw] md:pt-0">
          <p className="rotulo text-etiqueta text-amarillo">{slumberland.antetitulo}</p>
          <h2 id="slumberland-titulo" className="mt-2 font-display text-display text-texto">
            {slumberland.titulo}
          </h2>
          <p className="mt-1 text-body text-celeste italic">{slumberland.fecha}</p>
          <p className="mt-3 max-w-[26rem] text-body text-texto-2">{slumberland.cuerpo}</p>
        </div>

        <div ref={pieRef} className="absolute inset-x-4 bottom-[4svh] mx-auto max-w-[42rem] border-2 border-tinta bg-papel px-5 py-4 text-tinta shadow-[6px_6px_0_var(--color-rojo)] md:inset-x-0" style={{opacity: 0}} aria-hidden="true">
          {V.map((v, k) => (
            <p
              key={k}
              ref={(el) => {
                textoRefs.current[k] = el;
              }}
              className="text-[clamp(1rem,1.3vw,1.1875rem)] leading-snug"
              style={{display: 'none'}}
            >
              <span className="rotulo mr-2 text-[0.75rem] text-rojo-profundo">{k + 1}</span>
              {v.texto}
            </p>
          ))}
        </div>

        <p ref={suenoRef} className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[clamp(3rem,9vw,8rem)] text-amarillo" style={{opacity: 0}} aria-hidden="true">
          {slumberland.despierta}
        </p>
      </div>
    </section>
  );
}
