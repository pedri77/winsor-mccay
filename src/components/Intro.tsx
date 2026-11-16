import {extraUrl, IMG, intro} from '../content';
import {useAparecer} from '../hooks/useAparecer';

/** Quién era McCay: texto en papel de periódico con su retrato de 1906 en un marco de viñeta. */
export function Intro() {
  const ref = useAparecer<HTMLElement>();
  const r = IMG.extra.retrato;
  return (
    <section ref={ref} aria-labelledby="intro-titulo" className="relative bg-papel px-4 pt-[12svh] pb-[14svh] text-tinta sm:px-6 md:px-[6vw]">
      <div className="mx-auto grid max-w-[80rem] gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] md:gap-[6vw]">
        <div>
          <p data-aparece className="rotulo text-etiqueta text-rojo-profundo">
            {intro.antetitulo}
          </p>
          <h2 id="intro-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-3 font-display text-display">
            {intro.titulo}
          </h2>
          <div className="mt-8 grid gap-5 text-body">
            {intro.cuerpo.map((t, i) => (
              <p key={i} data-aparece style={{'--i': i + 2} as React.CSSProperties}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <figure data-aparece style={{'--i': 2} as React.CSSProperties} className="self-start md:mt-24">
          <div className="border-2 border-tinta bg-white p-2 shadow-[8px_8px_0_var(--color-rojo)]">
            <img src={extraUrl('retrato')} alt={intro.retrato} width={r.w} height={r.h} loading="lazy" decoding="async" className="block w-full grayscale" />
          </div>
          <figcaption className="mt-3 text-[0.875rem] italic">{intro.retrato}</figcaption>
        </figure>
      </div>
    </section>
  );
}
