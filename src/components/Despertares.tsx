import {useEffect, useRef, useState} from 'react';
import {commons, despertarUrl, despertares, fechaLarga, IMG, paginaFechaUrl} from '../content';
import {useAparecer} from '../hooks/useAparecer';
import {bloquearScroll} from '../lib/scroll';

/**
 * Cómo se despierta Nemo: rejilla con la última viñeta de 12 domingos. Cada una abre la página entera
 * en un visor modal con zoom (rueda, botones, + y −) y arrastre (puntero). ← y → cambian de domingo,
 * 0 vuelve a la vista entera y Esc cierra; el foco vuelve a la viñeta que lo abrió.
 */

const D = IMG.despertares;
const ZMAX = 5;

export function Despertares() {
  const ref = useAparecer<HTMLElement>();
  const [abierta, setAbierta] = useState<number | null>(null);
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const origenRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = dialogoRef.current!;
    if (abierta !== null && !d.open) {
      d.showModal();
      bloquearScroll(true);
    } else if (abierta === null && d.open) {
      d.close();
    }
  }, [abierta]);

  const cerrar = () => {
    setAbierta(null);
    bloquearScroll(false);
    origenRef.current?.focus();
  };

  return (
    <section ref={ref} id="despertares" aria-labelledby="despertares-titulo" className="relative bg-papel px-4 pt-[12svh] pb-[14svh] text-tinta sm:px-6 md:px-[6vw]">
      <div className="mx-auto max-w-[84rem]">
        <p data-aparece className="rotulo text-etiqueta text-rojo-profundo">
          {despertares.antetitulo}
        </p>
        <h2 id="despertares-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-2 font-display text-display">
          {despertares.titulo}
        </h2>
        <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-3 max-w-[38rem] text-body">
          {despertares.cuerpo}
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {D.map((d, k) => (
            <li key={d.fecha} data-aparece style={{'--i': k % 4} as React.CSSProperties}>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={despertares.abrir(fechaLarga(d.fecha))}
                onClick={(e) => {
                  origenRef.current = e.currentTarget;
                  setAbierta(k);
                }}
                className="group block w-full text-left"
              >
                <span className="block overflow-hidden border-2 border-tinta bg-white shadow-[5px_5px_0_var(--color-tinta)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-[7px_9px_0_var(--color-rojo)]">
                  <img src={despertarUrl(d.fecha)} alt="" width={d.w} height={d.h} loading="lazy" decoding="async" className="block aspect-[4/5] w-full object-cover" />
                </span>
                <span className="rotulo mt-3 block text-[0.75rem] text-rojo-profundo">{fechaLarga(d.fecha)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialogoRef} aria-label={abierta === null ? undefined : fechaLarga(D[abierta].fecha)} onClose={cerrar} className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0">
        {abierta !== null && <Visor k={abierta} cambiar={(n) => setAbierta((n + D.length) % D.length)} cerrar={cerrar} />}
      </dialog>
    </section>
  );
}

function Visor({k, cambiar, cerrar}: {k: number; cambiar: (n: number) => void; cerrar: () => void}) {
  const d = D[k];
  const [z, setZ] = useState(1);
  const [pos, setPos] = useState({x: 0, y: 0});
  const arrastre = useRef<{x: number; y: number; px: number; py: number} | null>(null);
  const marcoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZ(1);
    setPos({x: 0, y: 0});
  }, [k]);

  const zoom = (nz: number) => {
    const c = Math.min(ZMAX, Math.max(1, nz));
    setZ(c);
    if (c === 1) setPos({x: 0, y: 0});
  };

  useEffect(() => {
    const m = marcoRef.current!;
    const rueda = (e: WheelEvent) => {
      e.preventDefault();
      setZ((v) => {
        const c = Math.min(ZMAX, Math.max(1, v * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
        if (c === 1) setPos({x: 0, y: 0});
        return c;
      });
    };
    m.addEventListener('wheel', rueda, {passive: false});
    return () => m.removeEventListener('wheel', rueda);
  }, []);

  return (
    <div
      className="flex h-full flex-col text-texto"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') cambiar(k + 1);
        else if (e.key === 'ArrowLeft') cambiar(k - 1);
        else if (e.key === '+' || e.key === '=') zoom(z * 1.4);
        else if (e.key === '-') zoom(z / 1.4);
        else if (e.key === '0') zoom(1);
        else return;
        e.preventDefault();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 bg-void/95 px-4 py-3">
        <p className="rotulo text-[0.8125rem] text-amarillo">{fechaLarga(d.fecha)}</p>
        <div className="flex flex-wrap gap-1.5">
          <Boton onClick={() => cambiar(k - 1)} etiqueta={despertares.anterior}>
            ←
          </Boton>
          <Boton onClick={() => cambiar(k + 1)} etiqueta={despertares.siguiente}>
            →
          </Boton>
          <Boton onClick={() => zoom(z / 1.4)} etiqueta={despertares.alejar}>
            −
          </Boton>
          <Boton onClick={() => zoom(z * 1.4)} etiqueta={despertares.acercar}>
            +
          </Boton>
          <Boton onClick={() => zoom(1)} etiqueta={despertares.ajustar}>
            ⤢
          </Boton>
          <Boton onClick={cerrar} etiqueta={despertares.cerrar} autoFocus>
            ✕
          </Boton>
        </div>
      </div>
      <div
        ref={marcoRef}
        className="relative flex-1 touch-none overflow-hidden"
        style={{cursor: z > 1 ? 'grab' : 'zoom-in'}}
        onPointerDown={(e) => {
          if (z === 1) return;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          arrastre.current = {x: e.clientX, y: e.clientY, px: pos.x, py: pos.y};
        }}
        onPointerMove={(e) => {
          const a = arrastre.current;
          if (a) setPos({x: a.px + e.clientX - a.x, y: a.py + e.clientY - a.y});
        }}
        onPointerUp={() => {
          arrastre.current = null;
        }}
        onDoubleClick={() => zoom(z > 1 ? 1 : 2.5)}
      >
        <img
          src={paginaFechaUrl(d.fecha)}
          alt={`Página de Little Nemo in Slumberland del ${fechaLarga(d.fecha)}.`}
          width={d.pw}
          height={d.ph}
          draggable={false}
          className="absolute inset-0 m-auto max-h-full max-w-full object-contain select-none"
          style={{transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${z})`, transition: arrastre.current ? 'none' : 'transform 0.18s ease-out'}}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-void/95 px-4 py-2 text-[0.8125rem] text-texto-3">
        <span>{despertares.ayuda}</span>
        <a href={commons(d.fichero)} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-amarillo">
          {despertares.verCommons} ↗
        </a>
      </div>
    </div>
  );
}

function Boton({onClick, etiqueta, children, autoFocus}: {onClick: () => void; etiqueta: string; children: React.ReactNode; autoFocus?: boolean}) {
  return (
    <button type="button" onClick={onClick} aria-label={etiqueta} title={etiqueta} autoFocus={autoFocus} className="flex size-10 items-center justify-center rounded-full text-[1.125rem] ring-1 ring-texto-3 hover:bg-amarillo hover:text-tinta">
      {children}
    </button>
  );
}
