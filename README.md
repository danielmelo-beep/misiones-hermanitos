# Misiones · Frank & Valentina

La app de tareas, estudio y entrenamiento de Frank y Valentina, hecha con cariño. Es una **PWA**: se abre desde el navegador y se instala como un acceso directo en el celular, con su propio ícono y sin barra del navegador.

## Qué tiene

- **Misiones del día** con XP, niveles, rachas e insignias. Algunas piden foto como prueba.
- **Mensaje de Daniel** en la pantalla de cada uno y una celebración cuando completan todas las misiones del día.
- **Ruta del Tercero**: lecciones, retos, tablas con repetición espaciada y el robot de programación (`estudio.js`).
- **Entrenamiento de Marcha** (solo para Frank). Es una plantilla: el fisioterapeuta debe revisarla y ajustarla.
- **Recordatorios y horarios** (como Duolingo): avisos en el celular a la hora de bañarse (máximo 9:00 a. m.), tender la cama (9:30 a. m.), dejar uniforme y zapatos listos el día anterior (7:30 p. m., domingo a jueves) y hacer el aseo durante el día. Quien llega a tiempo gana +5 XP. Daniel recibe una alerta si alguno se pasa de la hora.
- **Laboratorio de Sistemas** (solo Frank): 5 laboratorios con pasos, registro de técnico, quiz y fotos de evidencia: conocer el equipo, probar con método, mantenimiento por dentro, mantenimiento del software y un caso de servicio técnico. Sube de rango: Aprendiz → Técnico junior → Técnico de sistemas → Ingeniero en práctica.
- **Profe** (para estudiar solos): botón de ayuda en cada pantalla de estudio. Lee en voz alta, da pistas de menos a más, muestra un ejemplo resuelto, explica de otra forma, explica palabras nuevas y permite **avisar a Daniel** (te llega una notificación). Tiene letra grande y lectura automática de preguntas.
- **English Club** (los dos): inglés desde cero con voz, cómo se pronuncia, ejercicios de escuchar, leer, decir y armar frases. Frank tiene unidades de computador y videojuegos; Valentina, de princesas y arte.
- **Taller de Arte** (Valentina): 6 dibujos originales para colorear con retos en inglés ("Color the crown yellow"), dibujo libre con stickers y galería. Los dibujos guardados los ves en el panel. La app de Valentina tiene su propio tema.
- **Centro de Mando** para Daniel: `index.html#panel` + PIN. Ve el progreso de hoy, la semana, las fotos y la bitácora.

## Primeros pasos de ingeniería (para Frank)

La carpeta [`ingenieria-frank`](ingenieria-frank/README.md) tiene una ruta de 8 pasos con ejercicios y dos proyectos para empezar a aprender sistemas: qué es un computador, algoritmos, HTML, JavaScript, Git y un primer juego.

## Activar los recordatorios

1. Instala la app en el celular (ver abajo) y ábrela desde el ícono. En iPhone es obligatorio instalarla (iOS 16.4 o superior).
2. Cada hermano entra con su nombre y toca **Activar recordatorios** (acepta el permiso).
3. Daniel entra a `index.html#panel`, pone el PIN y toca **Avisarme a mí**, en SU celular.

Los avisos salen de una función de Supabase (`enviar-recordatorios`) que corre cada minuto. Los horarios están en la tabla `horarios` de Supabase: se cambian ahí, sin tocar el código. Si un celular se comparte entre los dos hermanos, los avisos van al último que entró.

## Cómo instalarla en el celular

1. Abre el enlace de la app (GitHub Pages) en el navegador del celular.
2. **Android (Chrome):** toca *Instalar app* en la tarjeta de la pantalla de inicio, o menú ⋮ → *Instalar aplicación*.
3. **iPhone (Safari):** botón *Compartir* → *Agregar a pantalla de inicio*.

## Personalizar

- **Horarios de los avisos:** tabla `horarios` en Supabase (hora, días y texto). Los límites de cada misión están en `misiones.hora_limite` y `misiones.dias`.
- **Mensajes de Daniel:** constante `MENSAJES_DANIEL` en `index.html`.
- **PIN del panel:** constante `PANEL_PIN` en `index.html` (cámbialo; está en el código del navegador, así que solo evita entradas por accidente).
- **Misiones, avatares y colores:** tablas `misiones` y `ninos` en Supabase.
- **Íconos:** `python3 hacer-iconos.py` vuelve a generar los PNG a partir del mismo diseño que `icon.svg`.

## Archivos

- `index.html`: la app (diseño Misiones OS).
- `estudio.js`: Ruta del Tercero.
- `laboratorio.js`: Laboratorio de Sistemas (Frank).
- `profe.js`: el Profe (ayuda guiada). `english.js`: English Club. `arte.js`: Taller de Arte.
- `sw.js` y `manifest.webmanifest`: instalación y uso sin conexión.
- `schema.sql`: tablas base de Supabase.

## Seguridad

Los niños entran sin contraseña, por eso la base solo les permite leer datos, registrar misiones y deshacer las de los últimos días. El PIN del panel no es una protección fuerte. Si quieres algo más robusto, el panel puede pasar a Supabase Auth con tu correo.
