import {extraUrl, gertie, IMG} from '../content';
import {useAparecer} from '../hooks/useAparecer';

/** Gertie y el nacimiento de la animación: cifras, el dibujo original y la foto de las pilas de dibujos. */
export function Gertie() {
  const ref = useAparecer<HTMLElement>();
  const b = IMG.extra['gertie-boca'];
  const p = IMG.extra['gertie-pilas'];
  return (
    <section ref={ref} id="gertie" aria-labelledby="gertie-titulo" className="cielo relative px-4 pt-[14svh] pb-[14svh] sm:px-6 md:px-[6vw]">
      <div className="mx-auto max-w-[84rem]">
        <p data-aparece className="rotulo text-etiqueta text-amarillo">
          {gertie.antetitulo}
        </p>
        <h2 id="gertie-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-2 max-w-[20ch] font-display text-display text-texto">
          {gertie.titulo}
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-[5vw]">
          <div className="grid content-start gap-5 text-body text-texto-2">
            {gertie.cuerpo.map((t, i) => (
              <p key={i} data-aparece style={{'--i': i + 2} as React.CSSProperties}>
                {t}
              </p>
            ))}
            <dl className="mt-4 grid grid-cols-3 gap-3">
              {gertie.cifras.map((c, i) => (
                <div key={c.valor} data-aparece style={{'--i': i + 3} as React.CSSProperties} className="border-t-4 border-amarillo pt-3">
                  <dt className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-none text-amarillo">{c.valor}</dt>
                  <dd className="mt-2 text-[0.875rem] leading-snug">{c.texto}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid gap-5">
            <figure data-aparece style={{'--i': 2} as React.CSSProperties}>
              <img src={extraUrl('gertie-boca')} alt={gertie.original} width={b.w} height={b.h} loading="lazy" decoding="async" className="block w-full border-2 border-texto-3 bg-papel" />
              <figcaption className="mt-2 text-[0.875rem] text-texto-3 italic">{gertie.original}</figcaption>
            </figure>
            <figure data-aparece style={{'--i': 3} as React.CSSProperties} className="md:w-2/3 md:justify-self-end">
              <img src={extraUrl('gertie-pilas')} alt={gertie.pilas} width={p.w} height={p.h} loading="lazy" decoding="async" className="block w-full border-2 border-texto-3" />
              <figcaption className="mt-2 text-[0.875rem] text-texto-3 italic">{gertie.pilas}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
