import {useEffect} from 'react';
import {Creditos} from './components/Creditos';
import {Despertares} from './components/Despertares';
import {Gertie} from './components/Gertie';
import {Intro} from './components/Intro';
import {PalabraAPalabra} from './components/patrones/PalabraAPalabra';
import {Portada} from './components/Portada';
import {Slumberland} from './components/Slumberland';
import {tesis} from './content';
import {useMovimientoReducido} from './hooks/useMovimientoReducido';
import {iniciarScroll} from './lib/scroll';

/** Orden del guion: Gertie en el escenario · quién era · la cama que camina · despertares · Gertie · tesis · fuentes. */
export default function App() {
  const reducido = useMovimientoReducido();
  useEffect(() => iniciarScroll(reducido), [reducido]);
  return (
    <main>
      <Portada />
      <Intro />
      <Slumberland />
      <Despertares />
      <Gertie />
      <PalabraAPalabra frase={tesis.frase} firma={tesis.firma} etiqueta={tesis.etiqueta} />
      <Creditos />
    </main>
  );
}
