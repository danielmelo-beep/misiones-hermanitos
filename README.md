# Misiones · Frank & Valentina

Checklist gamificado para que Frank y Valentina marquen sus tareas del día (ducha, uniforme, zapatos, tablas, loza, cama) y tú veas el reporte desde el **Centro de Mando**.

## Cómo funciona

- **Pantalla de inicio:** cada hermano elige su personaje.
- **Misiones del día:** tocar una misión la marca como completada y suma XP. Si pide foto, abre la cámara.
- **Niveles, rachas e insignias** para motivar.
- **Centro de Mando (solo para ti):** entra a `index.html#panel`, ingresa el PIN y verás:
  - Progreso de hoy de cada uno.
  - XP y días activos de la semana.
  - Calendario de la semana por niño.
  - Galería de fotos de prueba.
  - Bitácora con las últimas 30 misiones.

## Configuración

1. Ejecuta `schema.sql` en el SQL Editor de Supabase (ya está aplicado en el proyecto `misiones-hermanitos`).
2. En `index.html`, cambia `PANEL_PIN` por tu PIN.
3. Sube la carpeta a cualquier hosting estático (GitHub Pages, Netlify, Vercel). Un solo archivo HTML.

## Personalizar

- **Misiones:** agrega, edita o desactiva filas en la tabla `misiones` (`activa = false` las oculta).
- **Foto de prueba:** cambia `requiere_foto` a `true` en cualquier misión.
- **Colores y avatares:** tabla `ninos`.

## Seguridad (importante)

- Los niños entran sin contraseña. Por eso la base solo permite leer datos, registrar misiones y borrar las del último par de días. No pueden cambiar misiones ni ver datos de otros proyectos.
- El PIN del panel está en el código del navegador, así que **no es una protección fuerte**. Sirve para que los niños no entren por accidente. Si quieres algo más robusto, puedo migrar el panel a Supabase Auth con tu correo.
