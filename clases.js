/* ============================================================
   ACADEMIA · v14
   Clases continuas con método:
   1) Meta + video  2) Explicación + ejemplo resuelto  3) Práctica guiada (con pistas)
   4) Videojuego de refuerzo ("Atrapa la respuesta")  5) Prueba de dominio (≥80 % para avanzar)
   6) Explícalo con tus palabras (técnica Feynman) + reto en la vida real.
   Repaso espaciado: cada clase dominada vuelve a los 1, 3, 7 y 21 días (repaso mezclado).
   Frank (11 años): Academia de Sistemas. Valentina: English Academy (A1 → A2).
   Los videos vienen de la tabla `videos` de Supabase (clase, youtube_id): se agregan sin tocar código.
   Depende de index.html: state, sb, $, esc, toast, hoy, lsGet/lsSet, show, lanzarConfetti, vibrar;
   de mundo.js: sonido, volverAMisiones, mundoRefrescar; de profe.js (opcional): profeHablar, profeContexto.
   ============================================================ */

/* ---------------- CONTENIDO ---------------- */
// Preguntas: { q, o:[correcta, distractores...], e: explicación, p: pista }. Tipo 'habla': { tipo:'habla', frase, es }
const ACADEMIA = {
  Frank: {
    titulo: 'Academia de Sistemas', e: '💻', color: '#22E4FF',
    sub: 'Aprende cómo funcionan los computadores y a pensar como programador.',
    modulos: [
      { id: 'sis1', e: '🖥️', t: 'Módulo 1 · ¿Cómo funciona un computador?', clases: [
        { id: 'sis1-1', e: '🧩', t: 'Las 4 partes de un computador',
          meta: 'Vas a poder decir qué hace cada parte de un computador: entrada, proceso, salida y memoria.',
          explica: [
            'Todo computador hace siempre lo mismo: recibe información (ENTRADA), la trabaja (PROCESO), la guarda (MEMORIA) y te muestra un resultado (SALIDA).',
            'El teclado, el mouse, la cámara y el micrófono son de ENTRADA. La pantalla, los parlantes y la impresora son de SALIDA.',
            'El cerebro que hace los cálculos se llama procesador o CPU. Y donde se guardan las cosas se llama memoria.',
          ],
          ejemplo: { t: 'Ejemplo resuelto: tomar una foto con el celular', pasos: ['ENTRADA: la cámara capta la luz.', 'PROCESO: el procesador convierte la luz en números y arregla los colores.', 'MEMORIA: la foto se guarda en el almacenamiento.', 'SALIDA: la pantalla te muestra la foto.'] },
          practica: [
            { q: '¿El teclado es de entrada o de salida?', o: ['Entrada', 'Salida', 'Memoria', 'Proceso'], e: 'Con el teclado le DAS información al computador.', p: 'Piensa: ¿tú le das información o él te la da a ti?' },
            { q: '¿Cuál de estos es de salida?', o: ['Los parlantes', 'El micrófono', 'El mouse', 'La cámara'], e: 'Los parlantes te ENTREGAN sonido.', p: '¿Cuál te entrega algo a ti?' },
            { q: '¿Cómo se llama el "cerebro" del computador?', o: ['Procesador (CPU)', 'Monitor', 'Teclado', 'Cable'], e: 'La CPU hace millones de cálculos por segundo.', p: 'Son tres letras: C-P-U.' },
            { q: 'Cuando hablas por el micrófono en un juego, tu voz es…', o: ['Entrada', 'Salida', 'Un virus', 'Una impresora'], e: 'La voz ENTRA al computador por el micrófono.', p: 'El micrófono recibe tu voz.' },
          ],
          dominio: [
            { q: 'Ordena: ¿qué pasa primero en un computador?', o: ['Entrada', 'Salida', 'Apagar', 'Imprimir'], e: 'Primero recibe información, luego la procesa y al final la muestra.' },
            { q: '¿Cuál de estos NO es de entrada?', o: ['La pantalla', 'El teclado', 'El mouse', 'La cámara'], e: 'La pantalla muestra (salida).' },
            { q: 'La impresora es un dispositivo de…', o: ['Salida', 'Entrada', 'Proceso', 'Memoria'], e: 'Saca la información en papel.' },
            { q: '¿Qué parte hace los cálculos?', o: ['El procesador', 'El mouse', 'Los parlantes', 'La pantalla'], e: 'El procesador procesa.' },
            { q: 'Cuando guardas un dibujo para verlo mañana, se va a la…', o: ['Memoria / almacenamiento', 'Pantalla', 'Impresora', 'Cámara'], e: 'Guardar = almacenamiento.' },
          ],
          feynman: 'Explícale a tu compañero virtual qué pasa (entrada, proceso, memoria, salida) cuando juegas un videojuego con el control.',
          reto: 'Busca en la casa 3 aparatos que tengan entrada y salida (ejemplo: el televisor con el control). Anótalos.' },
        { id: 'sis1-2', e: '🧠', t: 'Memoria RAM y disco: la mesa y el armario',
          meta: 'Vas a entender la diferencia entre la memoria RAM y el disco donde se guardan los archivos.',
          explica: [
            'La RAM es como tu MESA de trabajo: ahí pones lo que estás usando AHORA. Es rapidísima, pero cuando apagas el computador se borra todo.',
            'El disco (o almacenamiento) es como tu ARMARIO: ahí guardas tus cosas para siempre, aunque apagues. Es más lento que la RAM.',
            'Por eso cuando un juego "carga", está sacando cosas del armario (disco) y poniéndolas en la mesa (RAM).',
          ],
          ejemplo: { t: 'Ejemplo resuelto: abrir un juego', pasos: ['El juego está guardado en el disco (armario).', 'Al abrirlo, el computador copia lo que necesita a la RAM (mesa).', 'Mientras juegas, la CPU trabaja con lo que está en la RAM.', 'Cuando guardas la partida, se escribe en el disco para no perderla.'] },
          practica: [
            { q: 'Si se va la luz y no guardaste, ¿dónde estaba tu trabajo?', o: ['En la RAM', 'En el disco', 'En la impresora', 'En el mouse'], e: 'La RAM se borra al apagar.', p: 'Recuerda: ¿qué se borra cuando apagas?' },
            { q: 'El disco es como…', o: ['Un armario', 'Una mesa', 'Una puerta', 'Una ventana'], e: 'Guarda las cosas para siempre.', p: '¿Dónde guardas la ropa?' },
            { q: '¿Cuál es más rápida?', o: ['La RAM', 'El disco', 'Son iguales', 'Ninguna'], e: 'La RAM es la mesa: todo está a la mano.', p: 'La mesa está más cerca que el armario.' },
            { q: 'Cuando un juego dice "cargando…", está…', o: ['Pasando datos del disco a la RAM', 'Apagando el computador', 'Imprimiendo', 'Borrando el juego'], e: 'Saca las cosas del armario a la mesa.', p: 'Del armario… ¿a dónde?' },
          ],
          dominio: [
            { q: '¿Qué memoria se borra al apagar?', o: ['RAM', 'Disco', 'USB', 'Nube'], e: 'La RAM es temporal.' },
            { q: 'Tus fotos guardadas están en…', o: ['El almacenamiento (disco)', 'La RAM', 'El procesador', 'El teclado'], e: 'Se guardan para siempre.' },
            { q: '¿Por qué hay que "guardar" la partida?', o: ['Para pasarla al disco y no perderla', 'Para que el juego sea más rápido', 'Para apagar la pantalla', 'Para borrar la RAM'], e: 'Guardar = escribir en el disco.' },
            { q: 'Mesa es a RAM como armario es a…', o: ['Disco', 'Pantalla', 'Mouse', 'Parlante'], e: 'Así lo vimos en la clase.' },
            { q: 'Si un computador tiene más RAM, puede…', o: ['Tener más cosas abiertas a la vez', 'Guardar más fotos para siempre', 'Tener pantalla más grande', 'Hacer más ruido'], e: 'Mesa más grande = más cosas al tiempo.' },
          ],
          feynman: 'Explícale a tu compañero por qué un juego "carga" usando la mesa y el armario.',
          reto: 'Pregúntale a un adulto cuánta RAM y cuánto almacenamiento tiene su celular (está en Ajustes → Acerca del teléfono).' },
        { id: 'sis1-3', e: '🔢', t: 'El idioma secreto: 0 y 1 (binario)',
          meta: 'Vas a contar en binario y a entender cómo el computador guarda todo con ceros y unos.',
          explica: [
            'El computador solo entiende dos cosas: apagado (0) y encendido (1). Cada 0 o 1 se llama BIT.',
            'Con 8 bits juntos se forma un BYTE. Con muchos bytes se guardan letras, fotos, música y juegos.',
            'En binario cada posición vale el doble que la anterior, de derecha a izquierda: 1, 2, 4, 8, 16…',
          ],
          ejemplo: { t: 'Ejemplo resuelto: ¿cuánto vale 101 en binario?', pasos: ['Escribe los valores de derecha a izquierda: 4 · 2 · 1.', 'Pon el número debajo: 1 · 0 · 1.', 'Suma solo donde hay 1: 4 + 1.', 'Resultado: 101 en binario = 5.'] },
          practica: [
            { q: '¿Cuánto vale 10 en binario?', o: ['2', '10', '1', '3'], e: 'Valores 2·1 → 1 en el 2 = 2.', p: 'Las posiciones valen 2 y 1.' },
            { q: '¿Cuánto vale 11 en binario?', o: ['3', '11', '2', '4'], e: '2 + 1 = 3.', p: 'Suma las dos posiciones.' },
            { q: '¿Cuántos bits tiene un byte?', o: ['8', '2', '10', '100'], e: '1 byte = 8 bits.', p: 'Es un número que también son las patas de una araña.' },
            { q: '¿Cuánto vale 100 en binario?', o: ['4', '100', '3', '1'], e: 'Valores 4·2·1 → solo el 4.', p: 'La tercera posición vale 4.' },
          ],
          dominio: [
            { q: '¿Cuánto vale 111 en binario?', o: ['7', '111', '6', '3'], e: '4+2+1 = 7.' },
            { q: 'Un BIT puede ser…', o: ['0 o 1', 'Cualquier número', 'Una letra', 'Un color'], e: 'Solo dos valores.' },
            { q: '¿Cómo se escribe el 2 en binario?', o: ['10', '2', '11', '01'], e: 'Un 1 en la posición del 2.' },
            { q: '¿Cuánto vale 1000 en binario?', o: ['8', '1000', '4', '16'], e: 'Valores 8·4·2·1 → solo el 8.' },
            { q: '¿Cuánto vale 110 en binario?', o: ['6', '110', '5', '3'], e: '4 + 2 = 6.' },
          ],
          feynman: 'Explícale a tu compañero cómo se escribe tu edad en binario (pista: 11 = 8 + 2 + 1 → 1011).',
          reto: 'Haz 5 tarjetas de papel con 16, 8, 4, 2 y 1 puntos. Voltéalas para formar números del 1 al 31.' },
        { id: 'sis1-4', e: '🪟', t: 'Sistema operativo, apps y archivos',
          meta: 'Vas a saber qué es el sistema operativo y cómo se organizan los archivos en carpetas.',
          explica: [
            'El SISTEMA OPERATIVO es el jefe del computador: organiza todo y deja que las apps funcionen. Ejemplos: Windows, Android, iOS, Linux.',
            'Las APPS (aplicaciones o programas) hacen tareas: un juego, el navegador, la calculadora.',
            'Los ARCHIVOS son documentos, fotos o videos. Se ordenan en CARPETAS, como cajones dentro del armario.',
          ],
          ejemplo: { t: 'Ejemplo resuelto: ordenar tus tareas', pasos: ['Crea una carpeta "Colegio".', 'Dentro, crea carpetas "Matemáticas" y "Sociales".', 'Guarda cada tarea en su carpeta con un nombre claro: "taller-fracciones.docx".', 'Así encuentras todo rápido.'] },
          practica: [
            { q: 'Android es un…', o: ['Sistema operativo', 'Juego', 'Archivo', 'Cable'], e: 'Es el jefe de muchos celulares.', p: 'Es el "jefe" del celular.' },
            { q: 'Una foto es un…', o: ['Archivo', 'Sistema operativo', 'Procesador', 'Teclado'], e: 'Las fotos son archivos.', p: 'Se guarda en carpetas.' },
            { q: 'Las carpetas sirven para…', o: ['Ordenar archivos', 'Hacer el computador más rápido', 'Jugar', 'Imprimir'], e: 'Como cajones.', p: 'Piensa en cajones.' },
            { q: 'El navegador (como Chrome) es una…', o: ['App', 'Carpeta', 'Memoria', 'Pantalla'], e: 'Es un programa para ver páginas.', p: 'Se abre con un toque, como un juego.' },
          ],
          dominio: [
            { q: '¿Cuál es un sistema operativo?', o: ['Windows', 'Minecraft', 'Una foto', 'El mouse'], e: 'Windows organiza el computador.' },
            { q: '¿Qué hace el sistema operativo?', o: ['Organiza el computador y deja funcionar las apps', 'Solo muestra fotos', 'Imprime', 'Carga la batería'], e: 'Es el jefe.' },
            { q: '¿Cuál es el mejor nombre para un archivo?', o: ['taller-fracciones.docx', 'asdfgh.docx', 'nuevo(7).docx', 'aaaa'], e: 'Un nombre claro ayuda a encontrarlo.' },
            { q: 'Una carpeta dentro de otra se llama…', o: ['Subcarpeta', 'Bit', 'App', 'Virus'], e: 'Como un cajón dentro de otro.' },
            { q: 'Un juego instalado en el celular es…', o: ['Una app', 'El sistema operativo', 'Una carpeta', 'La RAM'], e: 'Es una aplicación.' },
          ],
          feynman: 'Explícale a tu compañero la diferencia entre sistema operativo, app y archivo.',
          reto: 'Con permiso, revisa las carpetas de un celular o computador y cuenta cuántas carpetas principales hay.' },
      ] },
      { id: 'sis2', e: '🤖', t: 'Módulo 2 · Piensa como programador', clases: [
        { id: 'sis2-1', e: '📋', t: 'Algoritmos: instrucciones paso a paso',
          meta: 'Vas a escribir algoritmos claros, como los que siguen los computadores.',
          explica: [
            'Un ALGORITMO es una lista de pasos ordenados para lograr algo. Una receta de cocina es un algoritmo.',
            'Los computadores no adivinan: hacen EXACTAMENTE lo que dicen los pasos. Por eso deben ser claros y en orden.',
            'Si cambias el orden, el resultado cambia. ¡No es lo mismo ponerse las medias antes o después de los zapatos!',
          ],
          ejemplo: { t: 'Ejemplo resuelto: algoritmo para lavarse los dientes', pasos: ['1. Mojar el cepillo.', '2. Poner crema dental.', '3. Cepillar 2 minutos arriba y abajo.', '4. Escupir y enjuagar.', '5. Lavar el cepillo y guardarlo.'] },
          practica: [
            { q: '¿Qué es un algoritmo?', o: ['Pasos ordenados para lograr algo', 'Un tipo de computador', 'Un virus', 'Una canción'], e: 'Como una receta.', p: 'Piensa en una receta.' },
            { q: 'Para hacer un sándwich, ¿qué va primero?', o: ['Sacar el pan', 'Comérselo', 'Lavar el plato', 'Cerrar la nevera'], e: 'Sin pan no hay sándwich.', p: '¿Qué necesitas antes de todo?' },
            { q: '¿Por qué el orden importa?', o: ['Porque el resultado cambia', 'No importa', 'Para que sea más largo', 'Para gastar batería'], e: 'Medias antes que zapatos.', p: 'Piensa en las medias y los zapatos.' },
            { q: 'Un computador sigue las instrucciones…', o: ['Exactamente como están', 'Como él quiere', 'Al revés', 'Solo si le gustan'], e: 'No adivina nada.', p: '¿Los computadores adivinan?' },
          ],
          dominio: [
            { q: '¿Cuál es un algoritmo?', o: ['Una receta de arepas', 'Un mouse', 'Una foto', 'Un parlante'], e: 'Tiene pasos en orden.' },
            { q: 'Si un paso está en el orden equivocado…', o: ['El resultado puede salir mal', 'Nada pasa', 'El computador lo arregla solo', 'Se vuelve más rápido'], e: 'El orden importa.' },
            { q: 'Un buen algoritmo debe ser…', o: ['Claro y ordenado', 'Largo y confuso', 'Secreto', 'En inglés'], e: 'Claridad ante todo.' },
            { q: 'Para ir al colegio, ¿qué va antes?', o: ['Vestirse', 'Entrar al salón', 'Hacer el recreo', 'Volver a casa'], e: 'Primero lo primero.' },
            { q: 'Los programadores escriben algoritmos para…', o: ['Decirle al computador qué hacer', 'Romper el computador', 'Pintar paredes', 'Cocinar'], e: 'Programar = dar instrucciones.' },
          ],
          feynman: 'Escríbele a tu compañero el algoritmo para tender tu cama en 5 pasos.',
          reto: 'Dale a alguien de la casa tu algoritmo de tender la cama y que lo siga AL PIE DE LA LETRA. ¿Funcionó?' },
        { id: 'sis2-2', e: '🐞', t: 'Bugs: encontrar y arreglar errores',
          meta: 'Vas a encontrar errores (bugs) en instrucciones y arreglarlos (depurar).',
          explica: [
            'Un BUG es un error en un programa. Hacer que algo funcione bien quitando los bugs se llama DEPURAR (debugging).',
            'Los programadores profesionales encuentran bugs todo el tiempo: equivocarse es normal, lo importante es probar y corregir.',
            'Método detective: 1) ¿qué esperaba que pasara? 2) ¿qué pasó? 3) ¿en qué paso se rompió? 4) arreglar y volver a probar.',
          ],
          ejemplo: { t: 'Ejemplo resuelto: el robot que no llega', pasos: ['Instrucciones: avanzar 2, girar derecha, avanzar 1. El robot choca.', 'Esperaba: llegar a la meta. Pasó: chocó con la pared.', 'Revisamos paso a paso: el giro debía ser a la IZQUIERDA.', 'Arreglamos el paso 2, probamos de nuevo: ¡llegó!'] },
          practica: [
            { q: '¿Qué es un bug?', o: ['Un error en un programa', 'Un insecto robot', 'Un juego', 'Un cable'], e: 'Error = bug.', p: 'Es algo que hace que falle.' },
            { q: 'Depurar significa…', o: ['Encontrar y arreglar errores', 'Borrar todo', 'Apagar el computador', 'Comprar otro'], e: 'Debugging.', p: 'Viene de "quitar bugs".' },
            { q: 'Algoritmo: "1. Ponerse zapatos 2. Ponerse medias". ¿Dónde está el bug?', o: ['El orden de los pasos', 'Falta un zapato', 'No hay bug', 'Las medias'], e: 'Medias primero.', p: '¿Qué va primero en tus pies?' },
            { q: 'Cuando encuentras un bug, lo mejor es…', o: ['Revisar paso a paso', 'Rendirte', 'Gritarle al computador', 'Borrar todo'], e: 'Método detective.', p: 'Piensa como detective.' },
          ],
          dominio: [
            { q: 'Equivocarse al programar es…', o: ['Normal: se prueba y se corrige', 'Prohibido', 'Señal de que no sirves', 'Imposible'], e: 'Todos los programadores tienen bugs.' },
            { q: 'Primer paso del método detective:', o: ['¿Qué esperaba que pasara?', 'Borrar el programa', 'Apagar', 'Pedir pizza'], e: 'Comparar lo esperado con lo que pasó.' },
            { q: 'Receta: "1. Hornear 2. Mezclar ingredientes". El bug es…', o: ['Hornear antes de mezclar', 'Mezclar', 'El horno', 'No hay bug'], e: 'Primero se mezcla.' },
            { q: 'Después de arreglar un bug hay que…', o: ['Volver a probar', 'Celebrar sin probar', 'Apagar', 'Borrarlo'], e: 'Siempre probar.' },
            { q: 'Debugging es otra palabra para…', o: ['Depurar', 'Dibujar', 'Descargar', 'Dormir'], e: 'Depurar = quitar bugs.' },
          ],
          feynman: 'Cuéntale a tu compañero un "bug" que te pasó en la vida real (se te olvidó algo) y cómo lo arreglaste.',
          reto: 'Escribe un algoritmo con un error escondido y dáselo a Valentina o a Daniel para que encuentre el bug.' },
        { id: 'sis2-3', e: '🔁', t: 'Ciclos: repetir sin cansarse',
          meta: 'Vas a usar ciclos (repetir) para escribir instrucciones más cortas.',
          explica: [
            'Un CICLO (o bucle) repite instrucciones varias veces. En vez de escribir "saltar" 10 veces, escribes "REPETIR 10 veces: saltar".',
            'Los videojuegos usan ciclos todo el tiempo: el juego repite "leer el control, mover, dibujar" muchas veces por segundo.',
            'Los ciclos hacen los programas más cortos y con menos errores.',
          ],
          ejemplo: { t: 'Ejemplo resuelto: dibujar un cuadrado con un robot', pasos: ['Sin ciclo: avanzar, girar, avanzar, girar, avanzar, girar, avanzar, girar (8 pasos).', 'Vemos que "avanzar, girar" se repite 4 veces.', 'Con ciclo: REPETIR 4 veces: avanzar, girar.', '¡De 8 pasos pasamos a 1 ciclo!'] },
          practica: [
            { q: '¿Qué hace un ciclo?', o: ['Repite instrucciones', 'Borra instrucciones', 'Apaga el juego', 'Cambia de color'], e: 'Ciclo = repetir.', p: 'Bucle, loop, repetir…' },
            { q: '"Aplaudir, aplaudir, aplaudir" con ciclo es…', o: ['Repetir 3 veces: aplaudir', 'Repetir 1 vez: aplaudir', 'Aplaudir 30', 'No se puede'], e: 'Se repite 3 veces.', p: 'Cuenta los aplausos.' },
            { q: 'Para dibujar un triángulo con un robot repites…', o: ['3 veces: avanzar y girar', '4 veces: avanzar y girar', '1 vez: avanzar', '10 veces: saltar'], e: 'Un triángulo tiene 3 lados.', p: '¿Cuántos lados tiene un triángulo?' },
            { q: 'Los ciclos hacen los programas…', o: ['Más cortos', 'Más largos', 'Más lentos', 'Imposibles'], e: 'Menos pasos.', p: 'Recuerda el cuadrado.' },
          ],
          dominio: [
            { q: '"Repetir 5 veces: saltar". ¿Cuántos saltos?', o: ['5', '1', '10', '0'], e: 'Cinco veces.' },
            { q: 'Otra palabra para ciclo es…', o: ['Bucle', 'Bug', 'Byte', 'Botón'], e: 'Bucle o loop.' },
            { q: 'Para un cuadrado: repetir ___ veces: avanzar y girar', o: ['4', '3', '2', '8'], e: '4 lados.' },
            { q: '"Repetir 2 veces: (aplaudir, saltar)". ¿Cuántos aplausos?', o: ['2', '4', '1', '3'], e: 'Un aplauso por vuelta.' },
            { q: 'Los videojuegos usan ciclos para…', o: ['Actualizar el juego muchas veces por segundo', 'Apagarse', 'Borrar partidas', 'Cobrar'], e: 'El ciclo del juego.' },
          ],
          feynman: 'Explícale a tu compañero cómo usarías un ciclo para que un personaje dé 10 pasos.',
          reto: 'Escribe con ciclos un "baile": repetir 4 veces (aplaudir, girar). Bailalo y enséñalo en la casa.' },
        { id: 'sis2-4', e: '🔀', t: 'Condicionales: SI pasa algo, ENTONCES…',
          meta: 'Vas a usar condiciones (si… entonces… si no…) para que un programa tome decisiones.',
          explica: [
            'Una CONDICIONAL decide qué hacer: SI algo es verdad, ENTONCES hace una cosa; SI NO, hace otra.',
            'Ejemplo: SI llueve, ENTONCES llevo sombrilla; SI NO, llevo gorra.',
            'En los juegos: SI el personaje toca una moneda, ENTONCES suma 1 punto. SI toca un enemigo, ENTONCES pierde una vida.',
          ],
          ejemplo: { t: 'Ejemplo resuelto: el semáforo', pasos: ['SI la luz está en verde → avanzar.', 'SI NO, SI está en amarillo → frenar con cuidado.', 'SI NO (está en rojo) → detenerse.', 'El programa revisa en orden y hace solo una cosa.'] },
          practica: [
            { q: 'SI tengo hambre, ENTONCES…', o: ['Como algo', 'Duermo', 'Me baño', 'Juego fútbol'], e: 'La acción responde a la condición.', p: '¿Qué haces cuando tienes hambre?' },
            { q: 'En un juego: SI tocas un enemigo, ENTONCES…', o: ['Pierdes una vida', 'Ganas el juego', 'Nada pasa', 'Se apaga el celular'], e: 'Así funcionan muchos juegos.', p: 'Enemigo = peligro.' },
            { q: '¿Qué palabra se usa para la otra opción?', o: ['SI NO', 'REPETIR', 'GUARDAR', 'BYTE'], e: 'SI… ENTONCES… SI NO…', p: 'Si… entonces… si ___' },
            { q: 'SI la nota es 4 o más, ENTONCES "ganó". Sacó 3. ¿Qué pasa?', o: ['No ganó (va al SI NO)', 'Ganó', 'Se repite', 'Se borra'], e: '3 es menos que 4.', p: '¿3 es 4 o más?' },
          ],
          dominio: [
            { q: 'Una condicional sirve para…', o: ['Tomar decisiones', 'Repetir 10 veces', 'Guardar fotos', 'Hacer ruido'], e: 'Decide qué camino seguir.' },
            { q: 'SI llueve ENTONCES sombrilla, SI NO gorra. Hace sol. ¿Qué llevas?', o: ['Gorra', 'Sombrilla', 'Las dos', 'Nada'], e: 'No llueve → SI NO.' },
            { q: 'SI tocas moneda ENTONCES +1. Tocas 3 monedas. ¿Puntos?', o: ['3', '1', '0', '6'], e: '+1 cada vez.' },
            { q: 'En el semáforo, rojo significa…', o: ['Detenerse', 'Avanzar rápido', 'Girar', 'Pitar'], e: 'Rojo = parar.' },
            { q: '¿Cuál combina ciclo y condicional?', o: ['Repetir 10 veces: SI hay moneda, recogerla', 'Saltar', 'Apagar el computador', 'Dibujar un círculo'], e: 'Repite y en cada vuelta decide.' },
          ],
          feynman: 'Inventa 3 reglas de un videojuego tuyo con SI… ENTONCES… y explícaselas a tu compañero.',
          reto: 'Juega "Simón dice" con condicionales: SI digo "Simón dice", ENTONCES lo haces; SI NO, te quedas quieto.' },
      ] },
      { id: 'sis3', e: '🌐', t: 'Módulo 3 · Internet y seguridad (pronto)', clases: [] },
      { id: 'sis4', e: '🎮', t: 'Módulo 4 · Crea tu videojuego (pronto)', clases: [] },
    ],
  },
  Valentina: {
    titulo: 'English Academy', e: '🇬🇧', color: '#FF8FC7',
    sub: 'Aprende a HABLAR inglés: escucha, repite en voz alta y úsalo con lo que te gusta.',
    modulos: [
      { id: 'eng1', e: '👋', t: 'Level A1 · Unit 1 · Hello, it\'s me!', clases: [
        { id: 'eng1-1', e: '🙋‍♀️', t: 'Introduce yourself · Preséntate',
          meta: 'Vas a poder saludar y presentarte en inglés: nombre, edad y de dónde eres.',
          vocab: [['Hello / Hi', 'Hola', '👋'], ['My name is…', 'Me llamo…', '📛'], ['I am … years old', 'Tengo … años', '🎂'], ['I am from Colombia', 'Soy de Colombia', '🇨🇴'], ['Nice to meet you', 'Mucho gusto', '🤝'], ['Goodbye / Bye', 'Adiós', '👋']],
          explica: ['En inglés la edad se dice con "am": I AM 13 years old (literal: "yo soy 13 años"). ¡No se usa "have"!', 'Para presentarte: Hello! My name is… I am … years old. I am from Colombia. Nice to meet you!'],
          ejemplo: { t: 'Ejemplo resuelto: presentación de una artista', pasos: ['Hello! → saludo.', 'My name is Sofía. → nombre.', 'I am 13 years old. → edad (con AM).', 'I am from Bogotá, Colombia. → de dónde eres.', 'I love drawing. Nice to meet you! → algo tuyo + despedida.'] },
          practica: [
            { q: '¿Cómo se dice "Me llamo Valentina"?', o: ['My name is Valentina', 'I have Valentina', 'Name my Valentina', 'I am name Valentina'], e: 'My name is…', p: 'Empieza por "My name…"' },
            { q: '"Tengo 13 años" en inglés es…', o: ['I am 13 years old', 'I have 13 years', 'I have 13 years old', 'Me 13 years'], e: 'En inglés la edad va con AM.', p: '¡Ojo! No se usa "have".' },
            { tipo: 'habla', frase: 'Hello! My name is Valentina.', es: '¡Hola! Me llamo Valentina.' },
            { q: '"Nice to meet you" significa…', o: ['Mucho gusto', 'Adiós', 'Buenas noches', 'Gracias'], e: 'Se dice al conocer a alguien.', p: 'Se dice al conocer a alguien nuevo.' },
            { tipo: 'habla', frase: 'I am from Colombia.', es: 'Soy de Colombia.' },
          ],
          dominio: [
            { q: 'Completa: "I ___ 13 years old."', o: ['am', 'have', 'is', 'are'], e: 'I am.' },
            { q: '¿Cuál es un saludo?', o: ['Hello', 'Goodbye', 'Pencil', 'Blue'], e: 'Hello = hola.' },
            { q: '"I am from Colombia" significa…', o: ['Soy de Colombia', 'Voy a Colombia', 'Me gusta Colombia', 'Vivo en Colombia hace años'], e: 'From = de (origen).' },
            { q: '¿Cómo te despides?', o: ['Goodbye', 'Hello', 'Nice', 'Name'], e: 'Goodbye = adiós.' },
            { q: 'Ordena: "name / my / is / Ana"', o: ['My name is Ana', 'Name my is Ana', 'Is my name Ana', 'Ana name is my'], e: 'My name is Ana.' },
          ],
          feynman: 'Graba (o di en voz alta) tu presentación completa en inglés para tu compañero: hello, name, age, from, nice to meet you.',
          reto: 'Preséntate en inglés a alguien de la casa. Pídele que te diga "Nice to meet you too!"' },
        { id: 'eng1-2', e: '🎨', t: 'Colors & art supplies · Colores y materiales',
          meta: 'Vas a nombrar colores y materiales de dibujo en inglés y describir tus dibujos.',
          vocab: [['red', 'rojo', '🔴'], ['blue', 'azul', '🔵'], ['yellow', 'amarillo', '🟡'], ['green', 'verde', '🟢'], ['pink', 'rosado', '🩷'], ['purple', 'morado', '🟣'], ['pencil', 'lápiz', '✏️'], ['brush', 'pincel', '🖌️'], ['crayons', 'crayolas', '🖍️'], ['paper', 'papel', '📄']],
          explica: ['En inglés el color va ANTES de la cosa: a RED apple (una manzana roja). ¡Al revés del español!', 'Para describir: "My dress is pink." · "I have a blue pencil."'],
          ejemplo: { t: 'Ejemplo resuelto: describir un dibujo', pasos: ['Miro mi dibujo: una princesa con vestido morado.', 'Color antes de la cosa: a purple dress.', 'Frase: "She has a purple dress."', 'Agrego: "The sky is blue and the sun is yellow."'] },
          practica: [
            { q: '"Pincel" en inglés es…', o: ['brush', 'pencil', 'paper', 'crayon'], e: 'Brush = pincel.', p: 'Empieza con B.' },
            { q: '¿Cómo se dice "una manzana roja"?', o: ['a red apple', 'an apple red', 'a apple red', 'red a apple'], e: 'Color antes de la cosa.', p: 'El color va primero.' },
            { tipo: 'habla', frase: 'My favorite color is purple.', es: 'Mi color favorito es morado.' },
            { q: '"Yellow" es…', o: ['amarillo', 'verde', 'azul', 'rojo'], e: 'Yellow = amarillo.', p: 'Es el color del sol.' },
            { tipo: 'habla', frase: 'I have a pink pencil.', es: 'Tengo un lápiz rosado.' },
          ],
          dominio: [
            { q: '"Crayons" son…', o: ['crayolas', 'pinceles', 'papeles', 'tijeras'], e: 'Crayons = crayolas.' },
            { q: '"El cielo es azul":', o: ['The sky is blue', 'The blue is sky', 'Sky blue is', 'The sky blue'], e: 'The sky is blue.' },
            { q: '¿Qué color es "green"?', o: ['verde', 'gris', 'morado', 'rosado'], e: 'Green = verde.' },
            { q: '"Un vestido rosado":', o: ['a pink dress', 'a dress pink', 'pink a dress', 'dress a pink'], e: 'Color antes.' },
            { q: '"Pencil" es…', o: ['lápiz', 'pincel', 'pintura', 'papel'], e: 'Pencil = lápiz.' },
          ],
          feynman: 'Haz un dibujo y descríbelo en voz alta en inglés con 3 frases usando colores.',
          reto: 'Pon etiquetas en inglés (pencil, brush, paper…) a tus materiales de dibujo por una semana.' },
        { id: 'eng1-3', e: '🔢', t: 'Numbers 1–20 & age · Números',
          meta: 'Vas a contar del 1 al 20 en inglés y decir edades y cantidades.',
          vocab: [['one, two, three', '1, 2, 3', '1️⃣'], ['four, five, six', '4, 5, 6', '🖐️'], ['seven, eight, nine, ten', '7, 8, 9, 10', '🔟'], ['eleven, twelve', '11, 12', '🕛'], ['thirteen, fourteen, fifteen', '13, 14, 15', '🎂'], ['twenty', '20', '2️⃣'], ['How old are you?', '¿Cuántos años tienes?', '❓']],
          explica: ['Del 13 al 19 terminan en -TEEN: thirteen, fourteen, fifteen… ¡por eso los adolescentes son "teenagers"!', 'Para preguntar la edad: "How old are you?" → "I am thirteen."'],
          ejemplo: { t: 'Ejemplo resuelto: contar tus colores', pasos: ['Cuento mis crayolas: hay 12.', '12 = twelve.', 'Frase: "I have twelve crayons."', 'Pregunta: "How many crayons do you have?"'] },
          practica: [
            { q: '13 en inglés es…', o: ['thirteen', 'thirty', 'three', 'twelve'], e: 'Termina en -teen.', p: 'Los "teens" terminan en -teen.' },
            { q: '"How old are you?" pregunta…', o: ['la edad', 'el nombre', 'el color', 'la ciudad'], e: 'Old = edad.', p: 'Old = viejo/edad.' },
            { tipo: 'habla', frase: 'I am thirteen years old.', es: 'Tengo trece años.' },
            { q: '"Twenty" es…', o: ['20', '12', '2', '22'], e: 'Twenty = 20.', p: 'Empieza con TW como twelve, pero es más grande.' },
            { tipo: 'habla', frase: 'How old are you?', es: '¿Cuántos años tienes?' },
          ],
          dominio: [
            { q: '15 es…', o: ['fifteen', 'fifty', 'five', 'fourteen'], e: 'Fifteen.' },
            { q: '"Eleven" es…', o: ['11', '7', '12', '1'], e: 'Eleven = 11.' },
            { q: 'Respuesta a "How old are you?":', o: ['I am twelve.', 'My name is Ana.', 'I am from Cali.', 'Blue.'], e: 'Se responde la edad.' },
            { q: '¿Qué número NO termina en -teen?', o: ['twelve', 'sixteen', 'nineteen', 'fourteen'], e: '11 y 12 son especiales.' },
            { q: '"I have eight pencils" = tengo ___ lápices', o: ['8', '18', '80', '3'], e: 'Eight = 8.' },
          ],
          feynman: 'Cuenta en voz alta del 1 al 20 en inglés para tu compañero sin mirar.',
          reto: 'Durante un día, cuenta en inglés las escaleras o los pasos que das en algún lugar de la casa.' },
        { id: 'eng1-4', e: '👨‍👩‍👧‍👦', t: 'My family · Mi familia',
          meta: 'Vas a presentar a tu familia en inglés.',
          vocab: [['mother / mom', 'mamá', '👩'], ['father / dad', 'papá', '👨'], ['brother', 'hermano', '👦'], ['sister', 'hermana', '👧'], ['grandmother / grandma', 'abuela', '👵'], ['grandfather / grandpa', 'abuelo', '👴'], ['This is my…', 'Este/esta es mi…', '👉']],
          explica: ['Para presentar a alguien: "This is my brother. His name is Frank." (his = de él, her = de ella).', '"I have one brother" = tengo un hermano.'],
          ejemplo: { t: 'Ejemplo resuelto: presentar a un hermano', pasos: ['This is my brother. → este es mi hermano.', 'His name is Frank. → HIS porque es hombre.', 'He is eleven years old. → he = él.', 'He likes video games. → algo que le gusta.'] },
          practica: [
            { q: '"Hermano" en inglés:', o: ['brother', 'sister', 'mother', 'father'], e: 'Brother.', p: 'Empieza con B.' },
            { q: 'Para un hombre se usa…', o: ['His name is', 'Her name is', 'She name is', 'My is name'], e: 'His = de él.', p: 'His para él, her para ella.' },
            { tipo: 'habla', frase: 'This is my brother. His name is Frank.', es: 'Este es mi hermano. Se llama Frank.' },
            { q: '"Grandmother" es…', o: ['abuela', 'mamá', 'tía', 'prima'], e: 'Grand + mother.', p: 'Grand = grande/abuelo.' },
            { tipo: 'habla', frase: 'I have one brother.', es: 'Tengo un hermano.' },
          ],
          dominio: [
            { q: '"Sister" es…', o: ['hermana', 'hermano', 'mamá', 'amiga'], e: 'Sister = hermana.' },
            { q: 'Completa: "This is my mom. ___ name is Laura."', o: ['Her', 'His', 'He', 'My'], e: 'Her para ella.' },
            { q: '"Dad" es…', o: ['papá', 'abuelo', 'hermano', 'tío'], e: 'Dad = papá.' },
            { q: '"He is eleven" significa…', o: ['Él tiene once años', 'Ella tiene once años', 'Él es el once', 'Yo tengo once'], e: 'He = él.' },
            { q: '¿Cómo presentas a tu abuelo?', o: ['This is my grandpa.', 'This is my sister.', 'My name is grandpa.', 'I am grandpa.'], e: 'This is my…' },
          ],
          feynman: 'Presenta a tu familia en inglés en voz alta: al menos 3 personas con his/her name.',
          reto: 'Dibuja tu árbol familiar con los nombres en inglés (mom, dad, brother…) y muéstraselo a Daniel.' },
      ] },
      { id: 'eng2', e: '🦄', t: 'Level A1 · Unit 2 · My world', clases: [
        { id: 'eng2-1', e: '🐱', t: 'Animals · Animales',
          meta: 'Vas a nombrar animales y decir cómo son.',
          vocab: [['cat', 'gato', '🐱'], ['dog', 'perro', '🐶'], ['horse', 'caballo', '🐴'], ['bird', 'pájaro', '🐦'], ['rabbit', 'conejo', '🐰'], ['butterfly', 'mariposa', '🦋'], ['big / small', 'grande / pequeño', '📏'], ['cute', 'tierno', '🥰']],
          explica: ['Igual que con colores, el adjetivo va antes: a SMALL cat, a BIG horse.', 'Para lo que te gusta: "I like cats." (en plural: cats, dogs).'],
          ejemplo: { t: 'Ejemplo resuelto: describir una mascota', pasos: ['I have a cat. → tengo un gato.', 'It is small and white. → es pequeño y blanco.', 'It is very cute! → ¡es muy tierno!', 'I like cats.'] },
          practica: [
            { q: '"Conejo" en inglés:', o: ['rabbit', 'horse', 'bird', 'dog'], e: 'Rabbit.', p: 'Empieza con R.' },
            { q: '"Un caballo grande":', o: ['a big horse', 'a horse big', 'big a horse', 'a horse is big a'], e: 'Adjetivo antes.', p: 'Como con los colores.' },
            { tipo: 'habla', frase: 'I like cats. They are cute.', es: 'Me gustan los gatos. Son tiernos.' },
            { q: '"Butterfly" es…', o: ['mariposa', 'mantequilla', 'mosca', 'pájaro'], e: '¡Aunque tiene "butter"!', p: 'Vuela y tiene alas de colores.' },
            { tipo: 'habla', frase: 'The bird is small and blue.', es: 'El pájaro es pequeño y azul.' },
          ],
          dominio: [
            { q: '"Dog" es…', o: ['perro', 'gato', 'pato', 'cerdo'], e: 'Dog = perro.' },
            { q: '"Small" significa…', o: ['pequeño', 'grande', 'rápido', 'bonito'], e: 'Small = pequeño.' },
            { q: '"Me gustan los perros":', o: ['I like dogs', 'I like dog', 'Me like dogs', 'I dogs like'], e: 'Plural: dogs.' },
            { q: '"Cute" es…', o: ['tierno', 'feo', 'grande', 'cortar'], e: 'Cute = tierno.' },
            { q: '¿Cuál es un animal?', o: ['horse', 'house', 'pencil', 'green'], e: 'Horse = caballo (¡no house!).' },
          ],
          feynman: 'Inventa un animal mágico y descríbelo en inglés con 3 frases (color, tamaño, cute).',
          reto: 'Dibuja tu animal mágico y escribe su descripción en inglés debajo.' },
        { id: 'eng2-2', e: '👗', t: 'Clothes & fashion · Ropa y moda',
          meta: 'Vas a describir ropa y crear un "outfit" en inglés.',
          vocab: [['dress', 'vestido', '👗'], ['skirt', 'falda', '🩳'], ['shirt / T-shirt', 'camisa / camiseta', '👕'], ['shoes', 'zapatos', '👟'], ['crown', 'corona', '👑'], ['jacket', 'chaqueta', '🧥'], ['She is wearing…', 'Ella lleva puesto…', '💃']],
          explica: ['Para decir qué lleva puesto alguien: "She is wearing a blue dress."', 'Recuerda: color antes de la prenda → a RED jacket.'],
          ejemplo: { t: 'Ejemplo resuelto: el outfit de una princesa', pasos: ['She is wearing → ella lleva puesto.', 'a long purple dress → un vestido largo morado.', 'and a golden crown → y una corona dorada.', '"She is wearing a long purple dress and a golden crown."'] },
          practica: [
            { q: '"Falda" en inglés:', o: ['skirt', 'shirt', 'shoes', 'dress'], e: 'Skirt.', p: 'Se parece a "shirt" pero con K.' },
            { q: '"Ella lleva puesto un vestido":', o: ['She is wearing a dress', 'She wears is dress', 'She have a dress wearing', 'Dress she wearing'], e: 'She is wearing…', p: 'She is wearing…' },
            { tipo: 'habla', frase: 'She is wearing a pink dress.', es: 'Ella lleva un vestido rosado.' },
            { q: '"Crown" es…', o: ['corona', 'cuervo', 'payaso', 'collar'], e: 'Crown = corona.', p: 'La usan reyes y reinas.' },
            { tipo: 'habla', frase: 'I like your jacket!', es: '¡Me gusta tu chaqueta!' },
          ],
          dominio: [
            { q: '"Shoes" son…', o: ['zapatos', 'medias', 'camisas', 'gafas'], e: 'Shoes = zapatos.' },
            { q: '"Una chaqueta negra":', o: ['a black jacket', 'a jacket black', 'black jacket a', 'jacket a black'], e: 'Color antes.' },
            { q: '"Dress" es…', o: ['vestido', 'falda', 'camisa', 'zapato'], e: 'Dress = vestido.' },
            { q: 'Completa: "He is ___ a green shirt."', o: ['wearing', 'wear', 'wears', 'worn'], e: 'Is wearing.' },
            { q: '"T-shirt" es…', o: ['camiseta', 'pantalón', 'sombrero', 'falda'], e: 'T-shirt = camiseta.' },
          ],
          feynman: 'Diseña un outfit para un personaje y descríbelo en inglés en voz alta: "She is wearing…"',
          reto: 'Dibuja 2 outfits de diseñadora y escribe debajo qué lleva cada uno en inglés.' },
      ] },
      { id: 'eng3', e: '🌟', t: 'Level A1 · Unit 3 · My day (pronto)', clases: [] },
    ],
  },
};

/* ---------------- utilidades ---------------- */
const AC = { cur: null, clase: null, paso: 0, i: 0, ac: 0, pista: false, malas: 0, filas: null, videos: null, juego: null, notas: '', repaso: null };
const acCurso = () => state.nino ? ACADEMIA[state.nino.nombre] : null;
const acTodas = () => { const c = acCurso(); return c ? c.modulos.flatMap(m => m.clases) : []; };
const acBuscar = (id) => acTodas().find(c => c.id === id);
function acMezcla(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const acSnd = (t) => { if (typeof sonido === 'function') sonido(t); };
const acHablar = (t, lang) => { if (typeof profeHablar === 'function') profeHablar(t, lang || 'es-CO'); };
const acDias = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
const AC_INTERVALOS = [1, 3, 7, 21];

async function acCargar(forzar){
  if (!state.nino) return;
  if (AC.filas && !forzar && AC.cargadoDe === state.nino.id) return;
  try {
    const [p, v] = await Promise.all([
      sb.from('progreso_estudio').select('leccion,puntaje,total,fecha,created_at').eq('nino_id', state.nino.id).or('leccion.like.clase:%,leccion.like.repaso:%').order('created_at', { ascending: true }).limit(2000),
      AC.videos ? Promise.resolve({ data: null }) : sb.from('videos').select('clase,youtube_id,titulo,canal').eq('activo', true),
    ]);
    AC.filas = p.data || []; AC.cargadoDe = state.nino.id;
    if (v && v.data) AC.videos = v.data;
  } catch(e){ console.error(e); AC.filas = AC.filas || []; AC.videos = AC.videos || []; }
}
/* Estado de una clase: dominada (≥80 % en la prueba), fecha, repasos hechos y próximo repaso */
function acEstado(id){
  const filas = (AC.filas || []);
  const dom = filas.find(f => f.leccion === 'clase:' + id && f.total && f.puntaje / f.total >= 0.8);
  if (!dom) return { dominada: false, intentos: filas.filter(f => f.leccion === 'clase:' + id).length };
  const reps = filas.filter(f => f.leccion === 'repaso:' + id && f.created_at > dom.created_at && f.total && f.puntaje / f.total >= 0.6);
  const etapa = Math.min(reps.length, AC_INTERVALOS.length);
  const ultima = reps.length ? reps[reps.length - 1].fecha : dom.fecha;
  const proxima = etapa >= AC_INTERVALOS.length ? null : (() => { const d = new Date(ultima + 'T12:00:00'); d.setDate(d.getDate() + AC_INTERVALOS[etapa]); return d.toLocaleDateString('en-CA'); })();
  return { dominada: true, fecha: dom.fecha, etapa, proxima, pendiente: !!proxima && proxima <= hoy() };
}
function acRepasosPendientes(){ return acTodas().filter(c => acEstado(c.id).pendiente); }
function acSiguiente(){
  for (const c of acTodas()){ if (!acEstado(c.id).dominada) return c; }
  return null;
}
function acDesbloqueada(id){
  const todas = acTodas(); const i = todas.findIndex(c => c.id === id);
  return i <= 0 || acEstado(todas[i - 1].id).dominada;
}

/* ---------------- entrada en la pantalla de misiones ---------------- */
function renderAcademiaEntry(){
  const box = $('#academia-entry'); if (!box) return;
  const cur = acCurso();
  if (!state.nino || !cur){ box.innerHTML = ''; return; }
  const pintar = () => {
    if (!state.nino) return;
    const sig = acSiguiente(), rep = acRepasosPendientes();
    const todas = acTodas(), dom = todas.filter(c => acEstado(c.id).dominada).length;
    box.innerHTML = `
      <div class="section-h" style="--c:${cur.color}">🎓 ${esc(cur.titulo.toUpperCase())}</div>
      <button class="ac-entry" id="ac-open" style="--ac:${cur.color}">
        <span class="ac-ee">${cur.e}</span>
        <span class="ac-et"><b>${sig ? 'Siguiente: ' + esc(sig.t) : '¡Completaste todas las clases disponibles!'}</b>
          <small>${dom}/${todas.length} clases dominadas${rep.length ? ` · <span class="ac-rep">🔁 ${rep.length} ${rep.length === 1 ? 'repaso' : 'repasos'} hoy</span>` : ''}</small>
          <span class="ac-bar"><i style="width:${todas.length ? Math.round(dom / todas.length * 100) : 0}%"></i></span></span>
        <span class="ac-go">${rep.length ? 'REPASAR ›' : 'ESTUDIAR ›'}</span>
      </button>`;
    $('#ac-open').onclick = () => openAcademia();
  };
  pintar();
  acCargar().then(pintar);
}

/* ---------------- hub: el mapa de la academia ---------------- */
async function openAcademia(){
  if (!state.nino) return;
  acInyectarCss();
  show('v-academia');
  $('#academia-body').innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px">Cargando tu academia…</p>';
  await acCargar(true);
  acHub();
}
function acHub(){
  const cur = acCurso(); const body = $('#academia-body'); if (!cur || !body) return;
  if (AC.juego) acJuegoParar();
  const rep = acRepasosPendientes();
  if (typeof profeContexto === 'function') profeContexto({
    titulo: cur.titulo,
    explica: 'Cada clase tiene 6 pasos: video, explicación con ejemplo, práctica con pistas, un videojuego de repaso, la prueba de dominio y explicarlo con tus palabras. Para abrir la siguiente clase necesitas 80 % en la prueba. Las clases que dominas vuelven como repaso a los 1, 3, 7 y 21 días para que no se te olviden.',
    voz: 'Cada clase tiene seis pasos. Para abrir la siguiente necesitas ochenta por ciento en la prueba. Las clases vuelven como repaso para que no se te olviden.',
    otra: 'Es como subir de nivel en un juego: no pasas al siguiente mundo sin vencer este.',
    pistas: ['Si hay repasos pendientes, hazlos primero: son rápidos.', 'Ve en orden: cada clase prepara la siguiente.'],
  });
  body.innerHTML = `
    <div class="ac-hero" style="--ac:${cur.color}"><span>${cur.e}</span><div><h2>${esc(cur.titulo)}</h2><p>${esc(cur.sub)}</p></div></div>
    ${rep.length ? `<button class="ac-repaso" id="ac-rep"><span>🔁</span><span><b>Repaso del día · ${rep.length} ${rep.length === 1 ? 'clase' : 'clases'}</b><small>Preguntas mezcladas de lo que ya sabes. ¡Así no se te olvida!</small></span><span class="ac-go">›</span></button>` : ''}
    ${cur.modulos.map(m => `
      <div class="ac-mod"><div class="ac-modt">${m.e} ${esc(m.t)}</div>
      ${m.clases.length ? `<div class="ac-path">${m.clases.map((c, i) => {
        const st = acEstado(c.id), abierta = acDesbloqueada(c.id);
        const cls = st.dominada ? 'ok' : abierta ? 'open' : 'lock';
        const sub = st.dominada ? (st.proxima ? (st.pendiente ? '🔁 repaso hoy' : `✅ dominada · repaso ${st.proxima.slice(5)}`) : '🏅 maestría total') : abierta ? (st.intentos ? 'intenta de nuevo la prueba' : '¡nueva!') : '🔒 domina la anterior';
        return `<button class="ac-node ${cls}" data-cl="${c.id}" style="--d:${i % 2 ? '28px' : '0px'}"><span class="ac-ne">${st.dominada ? '✅' : abierta ? c.e : '🔒'}</span><span><b>${esc(c.t)}</b><small>${esc(sub)}</small></span></button>`;
      }).join('')}</div>` : '<p class="ac-pronto">Muy pronto llegan clases nuevas aquí. 🚧</p>'}
      </div>`).join('')}
    <div style="text-align:center;margin-top:18px"><button class="btn ghost" id="ac-volver">← Volver a misiones</button></div>`;
  body.querySelectorAll('[data-cl]').forEach(b => b.onclick = () => {
    const id = b.dataset.cl;
    if (!acDesbloqueada(id)){ toast('Primero domina la clase anterior 🔒', true); acSnd('mal'); return; }
    acEmpezar(id);
  });
  const r = $('#ac-rep'); if (r) r.onclick = acRepasoEmpezar;
  $('#ac-volver').onclick = () => (typeof volverAMisiones === 'function' ? volverAMisiones() : (show('v-play'), renderPlay()));
}

/* ---------------- una clase, paso a paso ---------------- */
const AC_PASOS = ['🎬 Video', '📖 Aprende', '✍️ Practica', '🎮 Juego', '🏆 Prueba', '💬 Explícalo'];
function acEmpezar(id){
  AC.clase = acBuscar(id); AC.paso = 0; AC.i = 0; AC.ac = 0; AC.pista = false; AC.malas = 0; AC.notas = ''; AC.repaso = null;
  AC.practica = acMezcla(AC.clase.practica); AC.dominio = acMezcla(AC.clase.dominio);
  acSnd('abrir'); acPaso();
}
function acCabecera(){
  const c = AC.clase;
  return `<div class="ac-top"><button class="ac-x" id="ac-x" aria-label="Salir">✕</button><div class="ac-steps">${AC_PASOS.map((p, i) => `<i class="${i < AC.paso ? 'ok' : i === AC.paso ? 'now' : ''}" title="${p}"></i>`).join('')}</div><span class="ac-pn">${AC_PASOS[AC.paso]}</span></div>
    <div class="ac-ct">${c.e} ${esc(c.t)}</div>`;
}
function acPaso(){
  const body = $('#academia-body'); const c = AC.clase; if (!body || !c) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (AC.juego) acJuegoParar();
  let html = acCabecera();
  if (AC.paso === 0){
    const vids = (AC.videos || []).filter(v => v.clase === c.id);
    html += `<div class="ac-card"><div class="ac-k">🎯 META DE HOY</div><p class="ac-meta">${esc(c.meta)}</p></div>
      ${vids.length ? vids.map(v => `<div class="ac-video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube_id)}?rel=0&modestbranding=1&cc_load_policy=1&hl=es" title="${esc(v.titulo || 'Video')}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe><small>${esc(v.titulo || '')}${v.canal ? ' · ' + esc(v.canal) : ''}</small></div>`).join('')
        : `<div class="ac-card ac-novid">🎬 El video de esta clase llega pronto. Mientras tanto, sigue con la explicación.</div>`}
      ${c.vocab ? `<div class="ac-card"><div class="ac-k">🗣️ PALABRAS NUEVAS · toca para escuchar</div><div class="ac-vocab">${c.vocab.map(([en, es, e]) => `<button class="ac-voc" data-en="${esc(en)}"><span>${e}</span><b>${esc(en)}</b><small>${esc(es)}</small></button>`).join('')}</div></div>` : ''}
      <button class="btn ac-sig" id="ac-sig">Siguiente: aprende ›</button>`;
  } else if (AC.paso === 1){
    html += `<div class="ac-card">${c.explica.map(p => `<p class="ac-p">${esc(p)}</p>`).join('')}
      <button class="btn ghost ac-oir" id="ac-oir">🔊 Escuchar explicación</button></div>
      <div class="ac-card ac-ej"><div class="ac-k">🔍 ${esc(c.ejemplo.t.toUpperCase())}</div>${c.ejemplo.pasos.map((p, i) => `<div class="ac-ejp" style="animation-delay:${i * .35}s"><span>${i + 1}</span>${esc(p)}</div>`).join('')}</div>
      <button class="btn ac-sig" id="ac-sig">Ya entendí: a practicar ›</button>`;
  } else if (AC.paso === 2){
    html += acPregunta(AC.practica, true);
  } else if (AC.paso === 3){
    html += `<div class="ac-card"><div class="ac-k">🎮 VIDEOJUEGO DE REFUERZO · ATRAPA LA RESPUESTA</div><p class="ac-p">Las respuestas caen del cielo. Toca la correcta antes de que llegue al suelo. ¡Cada acierto te da combo!</p></div>
      <div class="ac-juego" id="ac-juego"><div class="ac-jq" id="ac-jq"></div><div class="ac-jhud"><span id="ac-jp">⭐ 0</span><span id="ac-jv">❤️❤️❤️</span></div></div>
      <button class="btn ac-sig" id="ac-jstart">▶ Jugar</button>`;
  } else if (AC.paso === 4){
    html += acPregunta(AC.dominio, false);
  } else if (AC.paso === 5){
    html += acFinal();
  }
  body.innerHTML = html;
  $('#ac-x').onclick = () => { if (AC.paso === 0 || confirm('¿Salir de la clase? Lo que llevas de esta clase no se guarda.')) acHub(); };
  const sig = $('#ac-sig'); if (sig) sig.onclick = () => { AC.paso++; AC.i = 0; AC.ac = 0; AC.pista = false; acSnd('pop'); acPaso(); };
  body.querySelectorAll('[data-en]').forEach(b => b.onclick = () => { acHablar(b.dataset.en, 'en-US'); acSnd('tap'); });
  const oir = $('#ac-oir'); if (oir) oir.onclick = () => acHablar(c.explica.join(' '), 'es-CO');
  if (AC.paso === 2 || AC.paso === 4) acPreguntaEventos(AC.paso === 2 ? AC.practica : AC.dominio, AC.paso === 2);
  if (AC.paso === 3) $('#ac-jstart').onclick = () => acJuego(acMezcla(c.practica.concat(c.dominio).filter(q => !q.tipo)));
  if (AC.paso === 5) acFinalEventos();
}

/* ---------- preguntas (práctica con pistas / prueba sin pistas) ---------- */
function acPregunta(lista, guiada){
  const q = lista[AC.i];
  const prog = `<div class="ac-prog">${lista.map((_, i) => `<i class="${i < AC.i ? 'ok' : i === AC.i ? 'now' : ''}"></i>`).join('')}</div>`;
  if (q.tipo === 'habla'){
    return `${prog}<div class="ac-card"><div class="ac-k">🎤 DILO EN VOZ ALTA</div>
      <p class="ac-frase">${esc(q.frase)}</p><p class="ac-es">${esc(q.es)}</p>
      <div class="ac-row"><button class="btn ghost" id="ac-escuchar">🔊 Escuchar</button><button class="btn ghost" id="ac-lento">🐢 Lento</button></div>
      <button class="btn ac-mic" id="ac-mic">🎤 Toca y habla</button>
      <div id="ac-oido" class="ac-oido"></div>
      <button class="btn ghost" id="ac-yalo" style="width:100%;margin-top:8px">✅ Ya lo dije bien en voz alta</button></div>`;
  }
  if (!q._o) q._o = acMezcla(q.o);
  return `${prog}<div class="ac-card"><div class="ac-k">${guiada ? '✍️ PRÁCTICA GUIADA · puedes pedir pista' : '🏆 PRUEBA DE DOMINIO · necesitas 80 %'}</div>
    <p class="ac-q">${esc(q.q)}</p>
    <div class="ac-ops">${q._o.map(o => `<button class="ac-op" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>
    ${guiada && q.p ? `<button class="ac-pista" id="ac-pista">💡 Pista</button><div id="ac-pt" class="ac-pt hidden">${esc(q.p)}</div>` : ''}
    <div id="ac-fb" class="ac-fb"></div></div>`;
}
function acPreguntaEventos(lista, guiada){
  const q = lista[AC.i];
  const avanzar = (bien) => {
    if (bien) AC.ac++;
    setTimeout(() => {
      AC.i++; AC.pista = false;
      if (AC.i >= lista.length){
        if (guiada){ AC.paso++; AC.i = 0; AC.ac = 0; acPaso(); }
        else acTerminarPrueba(lista.length);
      } else acPaso();
    }, bien ? 1100 : 2200);
  };
  if (q.tipo === 'habla'){
    const decir = (r) => acHablar(q.frase, 'en-US');
    $('#ac-escuchar').onclick = decir;
    $('#ac-lento').onclick = () => { try { const u = new SpeechSynthesisUtterance(q.frase); u.lang = 'en-US'; u.rate = 0.55; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch(e){ decir(); } };
    setTimeout(decir, 400);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = $('#ac-mic');
    if (!SR){ mic.classList.add('hidden'); }
    else mic.onclick = () => {
      try {
        const r = new SR(); r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 3;
        mic.textContent = '🎙️ Te escucho…'; mic.disabled = true;
        r.onresult = (ev) => {
          const alts = [...ev.results[0]].map(a => a.transcript);
          const pct = Math.max(...alts.map(t => acParecido(t, q.frase)));
          const oido = $('#ac-oido');
          if (pct >= 0.7){ oido.innerHTML = `✅ ¡Excelente! Entendí: "<b>${esc(alts[0])}</b>"`; oido.className = 'ac-oido bien'; acSnd('ok'); vibrar(30); avanzar(true); }
          else { oido.innerHTML = `Entendí: "<b>${esc(alts[0])}</b>". Escucha otra vez e inténtalo 💪`; oido.className = 'ac-oido mal'; acSnd('mal'); }
        };
        r.onerror = () => { $('#ac-oido').textContent = 'No te escuché bien. Revisa el permiso del micrófono o usa el botón de abajo.'; };
        r.onend = () => { mic.textContent = '🎤 Toca y habla'; mic.disabled = false; };
        r.start();
      } catch(e){ mic.classList.add('hidden'); }
    };
    $('#ac-yalo').onclick = () => { acSnd('ok'); avanzar(true); };
    return;
  }
  const pista = $('#ac-pista'); if (pista) pista.onclick = () => { AC.pista = true; $('#ac-pt').classList.remove('hidden'); pista.classList.add('hidden'); acSnd('tap'); };
  document.querySelectorAll('.ac-op').forEach(b => b.onclick = () => {
    const bien = b.dataset.o === q.o[0];
    const fb = $('#ac-fb');
    if (bien){
      b.classList.add('ok'); acSnd('ok'); vibrar(25);
      document.querySelectorAll('.ac-op').forEach(x => x.disabled = true);
      fb.innerHTML = `✅ ${esc(q.e || '¡Correcto!')}`; fb.className = 'ac-fb bien';
      avanzar(true);
    } else if (guiada){
      b.classList.add('bad'); b.disabled = true; acSnd('mal'); AC.malas++;
      fb.innerHTML = `Casi. ${q.p ? '💡 ' + esc(q.p) : 'Intenta otra vez.'}`; fb.className = 'ac-fb mal';
    } else {
      b.classList.add('bad'); acSnd('mal');
      document.querySelectorAll('.ac-op').forEach(x => { x.disabled = true; if (x.dataset.o === q.o[0]) x.classList.add('ok'); });
      fb.innerHTML = `La correcta era <b>${esc(q.o[0])}</b>. ${esc(q.e || '')}`; fb.className = 'ac-fb mal';
      avanzar(false);
    }
  });
}
function acParecido(a, b){
  const n = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  const A = n(a), B = n(b); if (!B.length) return 0;
  return B.filter(w => A.includes(w)).length / B.length;
}

async function acTerminarPrueba(total){
  const pct = Math.round(AC.ac / total * 100);
  const c = AC.clase; const aprobo = pct >= 80;
  if (AC.repaso) return acRepasoFin(total);
  const fila = { nino_id: state.nino.id, leccion: 'clase:' + c.id, puntaje: AC.ac, total, fecha: hoy(), notas: '' };
  if (aprobo){
    AC.aprobada = fila; AC.paso = 5; acPaso();
  } else {
    try { await sb.from('progreso_estudio').insert(fila); } catch(e){ console.error(e); }
    (AC.filas = AC.filas || []).push(Object.assign({ created_at: new Date().toISOString() }, fila));
    $('#academia-body').innerHTML = acCabecera() + `<div class="ac-card ac-center"><div class="ac-big">💪</div><h3>${pct} % · ¡Casi!</h3>
      <p class="ac-p">Necesitas 80 % para dominar la clase. Equivocarse es parte de aprender. Repasa la explicación y vuelve a intentarlo.</p>
      <button class="btn" id="ac-otra" style="width:100%">Repasar y volver a intentar</button>
      <button class="btn ghost" id="ac-mapa" style="width:100%;margin-top:8px">Volver al mapa</button></div>`;
    $('#ac-x').onclick = acHub;
    $('#ac-otra').onclick = () => { AC.paso = 1; AC.i = 0; AC.ac = 0; AC.dominio = acMezcla(c.dominio); AC.dominio.forEach(q => delete q._o); acPaso(); };
    $('#ac-mapa').onclick = acHub;
  }
}
function acFinal(){
  const c = AC.clase; const f = AC.aprobada;
  const mi = (typeof mascotaInfo === 'function') ? mascotaInfo() : null;
  const quien = mi && mi.nacida ? esc(mi.nombre) : 'tu compañero';
  return `<div class="ac-card ac-center"><div class="ac-big">🏆</div><h3>¡Prueba superada! ${f.puntaje}/${f.total}</h3>
    <p class="ac-p">Último paso: los que de verdad entienden algo, lo pueden explicar.</p></div>
    <div class="ac-card"><div class="ac-k">💬 EXPLÍCALE A ${quien.toUpperCase()}</div><p class="ac-p">${esc(c.feynman)}</p>
    <textarea id="ac-nota" class="ac-ta" maxlength="400" placeholder="Escríbelo con tus palabras (o dilo en voz alta y escribe un resumen)…"></textarea>
    ${(window.SpeechRecognition || window.webkitSpeechRecognition) ? `<button class="btn ghost" id="ac-dictar" style="width:100%;margin-top:6px">🎤 Dictar</button>` : ''}</div>
    <div class="ac-card ac-reto"><div class="ac-k">🌍 RETO EN LA VIDA REAL</div><p class="ac-p">${esc(c.reto)}</p></div>
    <button class="btn ac-sig" id="ac-fin">Guardar y terminar la clase ✓</button>`;
}
function acFinalEventos(){
  const dic = $('#ac-dictar');
  if (dic) dic.onclick = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const r = new SR();
      r.lang = state.nino.nombre === 'Valentina' && /eng/.test(AC.clase.id) ? 'en-US' : 'es-CO';
      dic.textContent = '🎙️ Te escucho…';
      r.onresult = (ev) => { const t = ev.results[0][0].transcript; const ta = $('#ac-nota'); ta.value = (ta.value + ' ' + t).trim(); };
      r.onend = () => { dic.textContent = '🎤 Dictar'; };
      r.start();
    } catch(e){}
  };
  $('#ac-fin').onclick = async () => {
    const nota = $('#ac-nota').value.trim();
    if (nota.length < 15){ toast('Escribe un poquito más: al menos una frase completa ✍️', true); return; }
    const b = $('#ac-fin'); b.disabled = true;
    const fila = Object.assign({}, AC.aprobada, { notas: nota.slice(0, 400) });
    const { error } = await sb.from('progreso_estudio').insert(fila);
    if (error){ console.error(error); toast('No se pudo guardar. Revisa tu internet e intenta otra vez.', true); b.disabled = false; return; }
    (AC.filas = AC.filas || []).push(Object.assign({ created_at: new Date().toISOString() }, fila));
    lanzarConfetti(state.nino.color); acSnd('nivel'); vibrar([60, 40, 60]);
    const sig = acSiguiente();
    $('#academia-body').innerHTML = `<div class="ac-card ac-center"><div class="ac-big">🎓</div><h3>¡Clase dominada!</h3>
      <p class="ac-p">${esc(AC.clase.t)} ya es tuya. Volverá como repaso mañana, en 3, 7 y 21 días para que nunca se te olvide.</p>
      ${sig ? `<button class="btn" id="ac-next" style="width:100%">Siguiente clase: ${esc(sig.t)} ›</button>` : ''}
      <button class="btn ghost" id="ac-mapa" style="width:100%;margin-top:8px">Volver al mapa</button></div>`;
    if (sig) $('#ac-next').onclick = () => acEmpezar(sig.id);
    $('#ac-mapa').onclick = acHub;
    if (typeof mundoRefrescar === 'function') mundoRefrescar();
  };
}

/* ---------------- repaso espaciado (mezclado) ---------------- */
function acRepasoEmpezar(){
  const clases = acRepasosPendientes(); if (!clases.length) return;
  const qs = [];
  clases.forEach(c => acMezcla(c.dominio).slice(0, clases.length === 1 ? 5 : clases.length === 2 ? 3 : 2).forEach(q => qs.push(Object.assign({ _c: c.id }, q, { _o: null }))));
  AC.repaso = { clases: clases.map(c => c.id), qs: acMezcla(qs).slice(0, 8), aciertos: {} };
  AC.clase = { id: 'repaso', e: '🔁', t: 'Repaso del día' }; AC.i = 0; AC.ac = 0; AC.paso = 4;
  AC.dominio = AC.repaso.qs; acSnd('abrir');
  acPaso();
  $('.ac-steps').innerHTML = ''; $('.ac-pn').textContent = '🔁 Repaso mezclado';
}
async function acRepasoFin(total){
  const R = AC.repaso; const filas = [];
  R.clases.forEach(id => {
    const qs = R.qs.filter(q => q._c === id);
    const bien = qs.filter(q => q._bien).length;
    filas.push({ nino_id: state.nino.id, leccion: 'repaso:' + id, puntaje: bien, total: qs.length, fecha: hoy(), notas: '' });
  });
  try { await sb.from('progreso_estudio').insert(filas); } catch(e){ console.error(e); }
  filas.forEach(f => (AC.filas = AC.filas || []).push(Object.assign({ created_at: new Date().toISOString() }, f)));
  AC.repaso = null; lanzarConfetti(state.nino.color); acSnd('nivel');
  $('#academia-body').innerHTML = `<div class="ac-card ac-center"><div class="ac-big">🧠</div><h3>Repaso terminado: ${AC.ac}/${total}</h3>
    <p class="ac-p">Tu cerebro acaba de guardar esto más fuerte. Cada repaso hace que dure más tiempo.</p>
    <button class="btn" id="ac-mapa" style="width:100%">Volver al mapa</button></div>`;
  $('#ac-mapa').onclick = acHub;
}
// marcar qué preguntas de repaso salieron bien
(function(){
  const orig = acPreguntaEventos;
  acPreguntaEventos = function(lista, guiada){
    orig(lista, guiada);
    if (!AC.repaso) return;
    const q = lista[AC.i];
    document.querySelectorAll('.ac-op').forEach(b => b.addEventListener('click', () => { q._bien = b.dataset.o === q.o[0]; }, { once: true }));
  };
})();

/* ---------------- videojuego de refuerzo: Atrapa la respuesta ---------------- */
function acJuegoParar(){ if (AC.juego){ cancelAnimationFrame(AC.juego.raf); AC.juego = null; } }
function acJuego(preguntas){
  const zona = $('#ac-juego'); const btn = $('#ac-jstart'); if (!zona) return;
  btn.classList.add('hidden');
  const G = AC.juego = { qs: preguntas.slice(0, 8), i: 0, pts: 0, combo: 0, vidas: 3, items: [], raf: 0, t0: 0, vel: 55 };
  const nueva = () => {
    zona.querySelectorAll('.ac-gota').forEach(x => x.remove());
    if (G.i >= G.qs.length || G.vidas <= 0) return fin();
    const q = G.qs[G.i];
    $('#ac-jq').textContent = q.q;
    const ops = acMezcla(q.o).slice(0, 3); if (!ops.includes(q.o[0])) ops[0] = q.o[0];
    const w = zona.clientWidth;
    G.items = acMezcla(ops).map((o, k) => {
      const el = document.createElement('button'); el.className = 'ac-gota'; el.textContent = o;
      el.style.left = Math.round(8 + k * (w - 16) / 3) + 'px'; el.style.width = Math.round((w - 40) / 3) + 'px';
      zona.appendChild(el);
      const it = { el, y: -60 - k * 35, ok: o === q.o[0] };
      el.onpointerdown = (ev) => { ev.preventDefault(); tocar(it); };
      return it;
    });
  };
  const tocar = (it) => {
    if (!AC.juego) return;
    if (it.ok){ G.combo++; G.pts += 10 * G.combo; acSnd('moneda'); vibrar(20); it.el.classList.add('ac-boom'); G.vel += 6; }
    else { G.combo = 0; G.vidas--; acSnd('mal'); vibrar([40, 30, 40]); it.el.classList.add('ac-mal'); }
    hud(); G.i++; setTimeout(() => { if (AC.juego) nueva(); }, 350);
  };
  const hud = () => { $('#ac-jp').textContent = `⭐ ${G.pts}${G.combo > 1 ? ` · combo x${G.combo}` : ''}`; $('#ac-jv').textContent = '❤️'.repeat(Math.max(0, G.vidas)) + '🖤'.repeat(3 - Math.max(0, G.vidas)); };
  const loop = (t) => {
    if (!AC.juego || !document.body.contains(zona)) return acJuegoParar();
    const dt = G.t0 ? Math.min(.05, (t - G.t0) / 1000) : 0; G.t0 = t;
    const alto = zona.clientHeight - 50;
    let cayo = false;
    G.items.forEach(it => { it.y += G.vel * dt; it.el.style.transform = `translateY(${it.y}px)`; if (it.ok && it.y > alto) cayo = true; });
    if (cayo){ G.items.forEach(it => it.el.onpointerdown = null); G.combo = 0; G.vidas--; acSnd('mal'); hud(); G.i++; G.items = []; setTimeout(() => { if (AC.juego) nueva(); }, 300); }
    G.raf = requestAnimationFrame(loop);
  };
  const fin = () => {
    acJuegoParar();
    const rec = Number(lsGet(`ac_juego_${state.nino.id}`)) || 0;
    if (G.pts > rec){ lsSet(`ac_juego_${state.nino.id}`, String(G.pts)); lanzarConfetti(state.nino.color); }
    zona.innerHTML = `<div class="ac-jfin"><div class="ac-big">${G.vidas > 0 ? '🎉' : '💥'}</div><b>${G.pts} puntos</b><small>${G.pts > rec ? '¡NUEVO RÉCORD!' : 'Récord: ' + rec}</small></div>`;
    acSnd(G.vidas > 0 ? 'nivel' : 'pop');
    const b = $('#ac-jstart'); b.classList.remove('hidden'); b.textContent = 'Siguiente: la prueba de dominio ›';
    b.onclick = () => { AC.paso = 4; AC.i = 0; AC.ac = 0; acPaso(); };
  };
  hud(); nueva(); G.raf = requestAnimationFrame(loop);
}

/* ---------------- panel de Daniel ---------------- */
async function renderPanelAcademia(){
  let filas = [];
  try {
    const { data } = await sb.from('progreso_estudio').select('nino_id,leccion,puntaje,total,fecha,notas,created_at').or('leccion.like.clase:%,leccion.like.repaso:%').order('created_at', { ascending: false }).limit(400);
    filas = data || [];
  } catch(e){ console.error(e); }
  const bloques = state.ninos.map(n => {
    const cur = ACADEMIA[n.nombre]; if (!cur) return '';
    const mine = filas.filter(f => f.nino_id === n.id);
    const todas = cur.modulos.flatMap(m => m.clases);
    const dominadas = todas.filter(c => mine.some(f => f.leccion === 'clase:' + c.id && f.total && f.puntaje / f.total >= 0.8));
    const notas = mine.filter(f => f.leccion.startsWith('clase:') && f.notas).slice(0, 3);
    const reps = mine.filter(f => f.leccion.startsWith('repaso:')).length;
    return `<div style="margin-top:10px"><b style="color:${esc(n.color)}">${esc(n.avatar)} ${esc(n.nombre)} · ${esc(cur.titulo)}</b>
      <div style="font-size:14px;margin-top:4px">${dominadas.length}/${todas.length} clases dominadas · ${reps} repasos hechos</div>
      <div class="mu-eqbar" style="margin-top:6px"><i style="width:${todas.length ? dominadas.length / todas.length * 100 : 0}%;background:${esc(n.color)}"></i></div>
      ${notas.map(f => { const c = todas.find(x => 'clase:' + x.id === f.leccion); return `<div style="margin-top:8px;padding:8px 10px;border-radius:8px;background:var(--panel2);font-size:13px"><b>💬 ${esc(c ? c.t : f.leccion)}</b><br>"${esc(f.notas)}"</div>`; }).join('')}</div>`;
  }).join('');
  return `<div class="panel-card" style="border-color:#22E4FF88"><div class="section-h" style="--c:var(--cyan);margin-top:0">// Academia</div>${bloques}
    <p style="color:var(--muted);font-size:12px;margin-top:10px">Las frases entre comillas son cómo explicaron la clase con sus palabras. Para agregar videos: tabla <b>videos</b> en Supabase (clase + youtube_id).</p></div>`;
}

/* ---------------- estilos ---------------- */
function acInyectarCss(){
  if (document.getElementById('ac-css')) return;
  const st = document.createElement('style'); st.id = 'ac-css';
  st.textContent = `
  .ac-entry{display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;width:100%;text-align:left;padding:14px;border-radius:18px;
    border:1px solid var(--ac);background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 22%,var(--panel)),var(--panel));box-shadow:0 0 30px -14px var(--ac)}
  .ac-ee{font-size:40px;text-align:center;animation:ac-bob 3s ease-in-out infinite}
  @keyframes ac-bob{50%{transform:translateY(-4px) rotate(-4deg)}}
  .ac-et b{display:block;font-size:16px;line-height:1.2} .ac-et small{display:block;color:var(--muted);font-size:12px;margin-top:4px;font-family:var(--m)}
  .ac-rep{color:var(--amber);font-weight:700}
  .ac-bar{display:block;height:8px;border-radius:99px;background:#ffffff14;overflow:hidden;margin-top:8px} .ac-bar i{display:block;height:100%;background:var(--ac);border-radius:99px}
  .ac-go{font-family:var(--m);font-size:12px;font-weight:700;color:var(--ac,var(--cyan))}
  .ac-hero{display:flex;gap:14px;align-items:center;padding:16px;border-radius:18px;border:1px solid var(--ac);background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 25%,var(--panel)),var(--panel2))}
  .ac-hero>span{font-size:48px} .ac-hero h2{font-size:22px} .ac-hero p{color:var(--muted);font-size:14px;margin-top:4px;line-height:1.35}
  .ac-repaso{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;width:100%;text-align:left;margin-top:12px;padding:14px;border-radius:16px;border:2px solid var(--amber);background:#FFB02014;animation:mu-pulse 1.8s ease-in-out infinite}
  .ac-repaso>span:first-child{font-size:32px} .ac-repaso b{display:block} .ac-repaso small{color:var(--muted);font-size:13px}
  .ac-mod{margin-top:18px} .ac-modt{font-family:var(--m);font-size:12px;letter-spacing:.12em;color:var(--dim);text-transform:uppercase;margin-bottom:8px}
  .ac-path{display:flex;flex-direction:column;gap:10px}
  .ac-node{display:flex;gap:12px;align-items:center;text-align:left;padding:12px 14px;border-radius:16px;border:1px solid var(--line2);background:var(--panel);margin-left:var(--d);width:calc(100% - var(--d));min-height:64px}
  .ac-node b{display:block;font-size:15px} .ac-node small{color:var(--muted);font-size:12px}
  .ac-ne{font-size:30px;width:40px;text-align:center;flex:none}
  .ac-node.ok{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 10%,var(--panel))}
  .ac-node.open{border-color:var(--kc,var(--cyan));box-shadow:0 0 0 2px color-mix(in srgb,var(--kc,#22E4FF) 40%,transparent);animation:ac-glow 2s ease-in-out infinite}
  @keyframes ac-glow{50%{box-shadow:0 0 18px -2px var(--kc,#22E4FF)}}
  .ac-node.lock{opacity:.5}
  .ac-pronto{color:var(--muted);font-size:14px;padding:10px;border:1px dashed var(--line2);border-radius:12px}
  .ac-top{display:flex;align-items:center;gap:10px}
  .ac-x{width:44px;height:44px;border-radius:12px;border:1px solid var(--line2);font-size:18px;color:var(--muted);flex:none}
  .ac-steps{display:flex;gap:4px;flex:1} .ac-steps i{flex:1;height:8px;border-radius:99px;background:#ffffff18} .ac-steps i.ok{background:var(--lime)} .ac-steps i.now{background:var(--kc,var(--cyan))}
  .ac-pn{font-family:var(--m);font-size:11px;color:var(--muted);flex:none}
  .ac-ct{font-weight:700;font-size:18px;margin:12px 0 4px}
  .ac-card{margin-top:12px;padding:14px;border-radius:16px;border:1px solid var(--line2);background:var(--panel)}
  .ac-k{font-family:var(--m);font-size:11px;letter-spacing:.14em;color:var(--kc,var(--cyan));margin-bottom:6px}
  .ac-meta{font-size:17px;font-weight:600;line-height:1.4}
  .ac-p{font-size:16px;line-height:1.5;margin-top:6px;font-weight:500}
  .ac-video{margin-top:12px;border-radius:16px;overflow:hidden;border:1px solid var(--line2);background:#000}
  .ac-video iframe{display:block;width:100%;aspect-ratio:16/9;border:0} .ac-video small{display:block;padding:8px 12px;color:var(--muted);font-size:12px;background:var(--panel)}
  .ac-novid{color:var(--muted);font-size:14px}
  .ac-vocab{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
  .ac-voc{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 6px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);min-height:84px}
  .ac-voc span{font-size:26px} .ac-voc b{font-size:14px} .ac-voc small{color:var(--muted);font-size:12px}
  .ac-voc:active{transform:scale(.95)}
  .ac-oir{width:100%;margin-top:10px}
  .ac-ej{border-color:var(--amber)} .ac-ejp{display:flex;gap:10px;align-items:flex-start;padding:8px 0;font-weight:500;line-height:1.4;animation:mu-in .5s both}
  .ac-ejp span{flex:none;width:26px;height:26px;border-radius:50%;background:var(--amber);color:#1a1000;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px}
  .ac-sig{width:100%;margin-top:14px;min-height:54px;font-size:15px}
  .ac-prog{display:flex;gap:6px;justify-content:center;margin-top:12px} .ac-prog i{width:10px;height:10px;border-radius:50%;background:#ffffff22} .ac-prog i.ok{background:var(--lime)} .ac-prog i.now{background:var(--kc,var(--cyan));box-shadow:0 0 8px var(--kc,var(--cyan))}
  .ac-q{font-size:19px;font-weight:700;line-height:1.35;margin:4px 0 12px}
  .ac-ops{display:grid;gap:8px}
  .ac-op{min-height:54px;padding:10px 14px;border-radius:12px;border:1px solid var(--line2);background:var(--panel2);font-weight:600;font-size:16px;text-align:left;transition:transform .1s}
  .ac-op:active{transform:scale(.98)} .ac-op.ok{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 18%,var(--panel2));animation:mu-pop .4s}
  .ac-op.bad{border-color:var(--pink);background:color-mix(in srgb,var(--pink) 15%,var(--panel2));animation:ac-shake .35s}
  @keyframes ac-shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  .ac-pista{margin-top:10px;color:var(--amber);font-weight:700;min-height:44px} .ac-pt{margin-top:6px;padding:10px;border-radius:10px;background:#FFB02018;color:var(--amber);font-weight:600}
  .ac-fb{margin-top:10px;font-weight:600;line-height:1.4;min-height:20px} .ac-fb.bien{color:var(--lime)} .ac-fb.mal{color:#FF9FBF}
  .ac-frase{font-size:24px;font-weight:700;line-height:1.3;text-align:center;margin:8px 0 4px} .ac-es{text-align:center;color:var(--muted)}
  .ac-row{display:flex;gap:8px;margin-top:12px} .ac-row .btn{flex:1}
  .ac-mic{width:100%;margin-top:10px;min-height:60px;font-size:17px;background:var(--pink);color:#fff}
  .ac-oido{margin-top:10px;text-align:center;font-weight:600;line-height:1.4} .ac-oido.bien{color:var(--lime)} .ac-oido.mal{color:var(--amber)}
  .ac-juego{position:relative;height:380px;margin-top:12px;border-radius:18px;overflow:hidden;border:1px solid var(--line2);
    background:radial-gradient(circle at 20% 20%,#ffffff10 0 2px,transparent 3px),radial-gradient(circle at 70% 60%,#ffffff10 0 2px,transparent 3px),linear-gradient(180deg,color-mix(in srgb,var(--kc,#22E4FF) 18%,#0A0F1F),#070A12);background-size:90px 90px,120px 120px,auto;touch-action:none}
  .ac-jq{position:absolute;top:0;left:0;right:0;padding:10px 12px;font-weight:700;font-size:15px;line-height:1.3;background:#000a;z-index:2;text-align:center}
  .ac-jhud{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;padding:8px 12px;font-family:var(--m);font-size:13px;background:#000a;z-index:2}
  .ac-gota{position:absolute;top:56px;min-height:48px;padding:6px;border-radius:14px;border:2px solid #fff6;background:linear-gradient(180deg,#ffffff2a,#ffffff10);color:#fff;font-weight:700;font-size:13px;line-height:1.15;box-shadow:0 6px 18px -6px #000;backdrop-filter:blur(4px)}
  .ac-gota.ac-boom{border-color:var(--lime);background:color-mix(in srgb,var(--lime) 50%,transparent);animation:ac-boom .35s forwards}
  .ac-gota.ac-mal{border-color:var(--pink);background:color-mix(in srgb,var(--pink) 50%,transparent);animation:ac-shake .3s}
  @keyframes ac-boom{to{opacity:0;scale:1.6}}
  .ac-jfin{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;z-index:3}
  .ac-jfin b{font-size:28px} .ac-jfin small{font-family:var(--m);color:var(--amber)}
  .ac-center{text-align:center} .ac-big{font-size:60px;line-height:1.1;animation:mu-pop .5s} .ac-center h3{font-size:22px;margin-top:6px}
  .ac-ta{width:100%;min-height:96px;margin-top:10px;padding:12px;border-radius:12px;border:1px solid var(--line2);background:var(--panel2);color:var(--ink);font-family:var(--f);font-size:16px;resize:vertical}
  .ac-reto{border-style:dashed;border-color:var(--lime)}
  @media (prefers-reduced-motion:reduce){.ac-ee,.ac-node.open,.ac-repaso{animation:none}}
  `;
  document.head.appendChild(st);
}
acInyectarCss();
