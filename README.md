# Misiones · Frank & Valentina

La app de tareas, estudio y entrenamiento de Frank y Valentina, hecha con cariño. Es una **PWA**: se abre desde el navegador y se instala como un acceso directo en el celular, con su propio ícono y sin barra del navegador.

## Qué tiene

- **Misiones del día** con XP, niveles, rachas e insignias. Algunas piden foto como prueba.
- **Mensaje de Daniel** en la pantalla de cada uno y una celebración cuando completan todas las misiones del día.
- **Ruta del Tercero**: lecciones, retos, tablas con repetición espaciada y el robot de programación (`estudio.js`).
- **Entrenamiento de Marcha** (solo para Frank). Es una plantilla: el fisioterapeuta debe revisarla y ajustarla.
- **Centro de Mando** para Daniel: `index.html#panel` + PIN. Ve el progreso de hoy, la semana, las fotos y la bitácora.

## Primeros pasos de ingeniería (para Frank)

La carpeta [`ingenieria-frank`](ingenieria-frank/README.md) tiene una ruta de 8 pasos con ejercicios y dos proyectos para empezar a aprender sistemas: qué es un computador, algoritmos, HTML, JavaScript, Git y un primer juego.

## Cómo instalarla en el celular

1. Abre el enlace de la app (GitHub Pages) en el navegador del celular.
2. **Android (Chrome):** toca *Instalar app* en la tarjeta de la pantalla de inicio, o menú ⋮ → *Instalar aplicación*.
3. **iPhone (Safari):** botón *Compartir* → *Agregar a pantalla de inicio*.

## Personalizar

- **Mensajes de Daniel:** constante `MENSAJES_DANIEL` en `index.html`.
- **PIN del panel:** constante `PANEL_PIN` en `index.html` (cámbialo; está en el código del navegador, así que solo evita entradas por accidente).
- **Misiones, avatares y colores:** tablas `misiones` y `ninos` en Supabase.
- **Íconos:** `python3 hacer-iconos.py` vuelve a generar los PNG a partir del mismo diseño que `icon.svg`.

## Archivos

- `index.html`: la app (diseño Misiones OS).
- `estudio.js`: Ruta del Tercero.
- `sw.js` y `manifest.webmanifest`: instalación y uso sin conexión.
- `schema.sql`: tablas base de Supabase.

## Seguridad

Los niños entran sin contraseña, por eso la base solo les permite leer datos, registrar misiones y deshacer las de los últimos días. El PIN del panel no es una protección fuerte. Si quieres algo más robusto, el panel puede pasar a Supabase Auth con tu correo.
