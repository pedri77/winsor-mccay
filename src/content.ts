/** Todo el texto de la página vive aquí. Los componentes no llevan texto suelto. */
import imagenes from './datos/imagenes.json';

export const IMG = imagenes;
const base = import.meta.env.BASE_URL;
export const gertieBase = `${base}gertie/d`;
export const GERTIE_N = 120;
export const paginaUrl = `${base}nemo/pagina.webp`;
export const despertarUrl = (fecha: string) => `${base}nemo/despertar/${fecha}.webp`;
export const paginaFechaUrl = (fecha: string) => `${base}nemo/paginas/${fecha}.webp`;
export const extraUrl = (id: string) => `${base}extra/${id}.webp`;
export const commons = (fichero: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fichero.replace(/ /g, '_'))}`;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const fechaLarga = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
};

export const portada = {
  antetitulo: 'Winsor McCay · 1905–1914',
  titulo: 'Dibujar sueños',
  bajada: 'El hombre que llevó los sueños al periódico del domingo y enseñó a un dinosaurio a saludar.',
  invitacion: 'Desliza: Gertie está saliendo de la cueva',
  capitulos: [
    {desde: 0.3, hasta: 0.58, texto: '1914. Un dinosaurio sale de una cueva y mira al público. Es Gertie, y cada uno de sus movimientos es un dibujo hecho a mano.'},
    {desde: 0.64, hasta: 0.92, texto: 'Fondos incluidos: McCay y su ayudante redibujaron el paisaje en cada hoja. No había acetatos ni atajos.'},
  ],
  pie: 'Gertie the Dinosaur (1914), fotogramas del minuto 9',
  etiqueta: 'Fotogramas de Gertie the Dinosaur (1914): Gertie sale de su cueva, se acerca y se come un árbol',
};

export const intro = {
  antetitulo: 'Quién era',
  titulo: 'Un dibujante de cartel de feria que acabó inventando cómo se mueven los dibujos.',
  cuerpo: [
    'Winsor McCay dibujaba carteles para circos y barracas antes de llegar a la prensa de Nueva York. El 15 de octubre de 1905 publicó en el New York Herald la primera página de Little Nemo in Slumberland: un niño que cada domingo entraba en el país de los sueños.',
    'Cada página terminaba igual: Nemo se despertaba, casi siempre en el suelo o enredado en las sábanas. Entre medias, McCay probaba perspectivas, tamaños de viñeta y arquitecturas que el cómic tardó décadas en volver a intentar.',
    'Después se pasó a la animación. Little Nemo (1911) y Gertie the Dinosaur (1914) están entre las primeras películas de dibujos con personajes que parecen pensar.',
  ],
  retrato: 'Winsor McCay en 1906',
};

export const slumberland = {
  antetitulo: 'Una noche en Slumberland',
  titulo: 'La cama que camina',
  fecha: '26 de julio de 1908',
  cuerpo: 'Una página entera, viñeta a viñeta. A la cama le crecen las patas y sale a pasear por la ciudad con Nemo y Flip encima.',
  etiqueta: 'Página de Little Nemo in Slumberland del 26 de julio de 1908, leída viñeta a viñeta',
  despierta: '¡Era un sueño!',
  /** Cajas (0–1) leídas sobre el escaneo; textos: traducción propia de los bocadillos. */
  vinetas: [
    {caja: [0.008, 0.005, 0.2, 0.195], texto: '«¡Échate para allá, Nemo! ¿Quieres toda la cama para ti?»'},
    {caja: [0.205, 0.005, 0.4, 0.195], texto: '«¡Anda! ¿Estás aquí, Flip? ¿Cómo has…?»'},
    {caja: [0.405, 0.005, 0.6, 0.195], texto: '«¡Pues claro! ¿O te crees que yo no duermo nunca? ¡Pero quiero sitio!»'},
    {caja: [0.603, 0.005, 0.797, 0.195], texto: '«No sabía que estabas aquí…» «¿Qué le pasa a esta cama? Está creciendo, ¿no?»'},
    {caja: [0.8, 0.005, 0.995, 0.195], texto: '«¡Ya lo creo que crece!» «¡Mírala! ¡Está andando con nosotros encima!»'},
    {caja: [0.008, 0.198, 0.2, 0.498], texto: '«Es la primera vez que veo andar a una cama.» «¡Bah! Va a salir a la calle a darse un buen paseo.»'},
    {caja: [0.205, 0.198, 0.4, 0.498], texto: '«Mejor no vamos.» «¿Por qué no? ¡Claro que vamos!»'},
    {caja: [0.405, 0.198, 0.6, 0.498], texto: '«¡Qué contenta está!»'},
    {caja: [0.603, 0.198, 0.797, 0.498], texto: '«¡Se porta como si estuviera loca! ¡Tengo miedo!» «¡Bah! Solo está jugando, nada más.»'},
    {caja: [0.8, 0.198, 0.995, 0.498], texto: '«¡A una cama también le gusta salir de vez en cuando!»'},
    {caja: [0.005, 0.5, 0.2, 0.995], texto: '«¡Te digo, Flip, que esto no es seguro! ¡Me bajo!» «¿Y cómo piensas bajarte? ¡Quédate donde estás, Nemo!»'},
    {caja: [0.205, 0.5, 0.4, 0.995], texto: '«¡Vamos tan rápido como ella pueda correr! ¡Anda! ¡Se está subiendo a los tejados!»'},
    {caja: [0.405, 0.5, 0.6, 0.995], texto: '«¡Ojalá fuera tan valiente como tú!» «¡Eso mismo quisiera mucha gente!»'},
    {caja: [0.603, 0.5, 0.797, 0.995], texto: '«¡Hemos chocado con algo! ¡Ay! ¡Ay!» «¡Lo que yo decía! ¡Tenía que tropezar con algo!»'},
    {caja: [0.8, 0.5, 0.995, 0.802], texto: '«¡No grites hasta que te hagas daño! ¿Me oyes?»'},
    {caja: [0.8, 0.805, 0.995, 0.995], texto: '«¡Uf! ¡Qué miedo he pasado! Menos mal que solo era un sueño.» «¡Ya se ha vuelto a caer ese niño de la cama!»'},
  ] as {caja: [number, number, number, number]; texto: string}[],
};

export const despertares = {
  antetitulo: 'Cómo se despierta Nemo',
  titulo: 'Siempre acaba en el suelo',
  cuerpo: 'La última viñeta de doce domingos entre 1905 y 1911. Pulsa una para ver la página entera y recorrerla con zoom.',
  abrir: (fecha: string) => `Abrir la página del ${fecha}`,
  cerrar: 'Cerrar',
  acercar: 'Acercar',
  alejar: 'Alejar',
  ajustar: 'Ver entera',
  anterior: 'Domingo anterior',
  siguiente: 'Domingo siguiente',
  ayuda: 'Arrastra para mover · rueda o + y − para el zoom · ← → para cambiar de domingo',
  verCommons: 'Ver en Commons',
};

export const gertie = {
  antetitulo: 'Gertie y el nacimiento de la animación',
  titulo: 'Un dinosaurio que obedecía (a veces)',
  cuerpo: [
    'McCay presentaba a Gertie en su número de vodevil: él daba órdenes desde el escenario y ella, en la pantalla, obedecía o se rebelaba. Al final, McCay salía de escena y aparecía dibujado a lomos del dinosaurio.',
    'Para la película se hicieron miles de dibujos en papel de arroz, con el paisaje redibujado en cada uno. Gertie fue de los primeros personajes animados con carácter propio: se distrae, se enfada y llora.',
  ],
  cifras: [
    {valor: '1914', texto: 'estreno en el vodevil'},
    {valor: '≈10.000', texto: 'dibujos a mano, según la cifra más citada'},
    {valor: '0', texto: 'acetatos: cada hoja llevaba el fondo dibujado'},
  ],
  original: 'Dibujo original de Gertie con la boca abierta',
  pilas: 'Ayudantes de McCay apilando los dibujos de la película',
};

export const tesis = {
  etiqueta: 'Tesis',
  frase: 'McCay dibujó durante años lo que pasa entre dormirse y *caerse de la cama.* Nadie lo ha hecho mejor desde entonces.',
  firma: 'Little Nemo in Slumberland, 1905–1911',
};

export const creditos = {
  antetitulo: 'Fuentes',
  titulo: 'Cómo está hecha',
  cuerpo:
    'Las páginas de Little Nemo in Slumberland (New York Herald, 1905–1911), los fotogramas de Gertie the Dinosaur (1914) y las fotos proceden de Wikimedia Commons y son de dominio público: McCay murió en 1934 y todo lo publicado hasta 1930 es libre también en EE. UU. Traducciones y textos propios.',
  aviso: 'Se usan los escaneos de los periódicos originales, no restauraciones ni coloreados modernos.',
  fuentes: [
    {texto: 'Little Nemo in Slumberland en Commons', url: 'https://commons.wikimedia.org/wiki/Category:Little_Nemo_in_Slumberland'},
    {texto: 'Gertie the Dinosaur (1914) en Commons', url: 'https://commons.wikimedia.org/wiki/Category:Gertie_the_Dinosaur_(1914_film)'},
    {texto: 'Federant y Literata, tipografías libres (SIL OFL)', url: 'https://fonts.google.com/'},
  ],
  volver: 'Volver arriba',
  wordmark: 'Slumberland',
  firma: 'Textos y código hechos con IA (Claude) y revisados, como pieza de portfolio.',
};
