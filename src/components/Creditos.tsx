import {commons, creditos, fechaLarga, IMG} from '../content';
import {useAjustarTexto} from '../hooks/useAjustarTexto';
import {useAparecer} from '../hooks/useAparecer';
import {irA} from '../lib/scroll';

/** Cierre: fuentes, enlace a cada página usada y wordmark de borde a borde. */
export function Creditos() {
  const ref = useAparecer<HTMLElement>();
  const marca = useAjustarTexto<HTMLSpanElement>();
  const paginas = [IMG.pagina, ...IMG.despertares];
  return (
    <footer ref={ref} aria-labelledby="creditos-titulo" className="cielo relative pt-[12svh]">
      <div className="mx-auto grid max-w-[84rem] gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.2fr] md:px-[6vw]">
        <div>
          <p data-aparece className="rotulo text-etiqueta text-amarillo">
            {creditos.antetitulo}
          </p>
          <h2 id="creditos-titulo" data-aparece style={{'--i': 1} as React.CSSProperties} className="mt-2 font-display text-display text-texto">
            {creditos.titulo}
          </h2>
          <p data-aparece style={{'--i': 2} as React.CSSProperties} className="mt-5 text-body text-texto-2">
            {creditos.cuerpo}
          </p>
          <p data-aparece style={{'--i': 3} as React.CSSProperties} className="mt-4 border-l-4 border-amarillo pl-4 text-[1rem] text-texto-2 italic">
            {creditos.aviso}
          </p>
          <button
            type="button"
            onClick={() => irA('#inicio')}
            data-aparece
            style={{'--i': 4} as React.CSSProperties}
            className="mt-8 rounded-full px-5 py-2.5 text-[1rem] font-semibold text-amarillo ring-2 ring-amarillo transition-colors hover:bg-amarillo hover:text-tinta"
          >
            ↑ {creditos.volver}
          </button>
          <p className="mt-8 text-[0.875rem] text-texto-3">{creditos.firma}</p>
        </div>
        <div data-aparece style={{'--i': 2} as React.CSSProperties}>
          <ul className="grid gap-2 text-[0.9375rem] text-texto-2">
            {creditos.fuentes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noopener" className="underline decoration-borde underline-offset-4 hover:text-texto hover:decoration-amarillo">
                  {f.texto} ↗
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-6 columns-2 gap-6 text-[0.875rem] leading-relaxed text-texto-3">
            {paginas.map((p) => (
              <li key={p.fecha} className="break-inside-avoid">
                <a href={commons(p.fichero)} target="_blank" rel="noopener" className="underline decoration-borde underline-offset-4 hover:text-texto">
                  Little Nemo, {fechaLarga(p.fecha)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-[10svh] overflow-hidden px-4 pt-[0.1em] sm:px-6 md:px-[6vw]" aria-hidden="true">
        <span ref={marca} className="inline-block font-display leading-[1.1] whitespace-nowrap text-amarillo">
          {creditos.wordmark}
        </span>
      </div>
    </footer>
  );
}
