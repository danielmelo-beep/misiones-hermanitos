# Paso 3 · Tu primera página web

## La idea

Todas las páginas web están hechas con un lenguaje llamado **HTML**. No es un lenguaje para "pensar" como un algoritmo, sino para **describir** qué hay en la página: títulos, textos, listas, botones.

Para escribirlo usas **etiquetas**. Casi todas se abren y se cierran:

```html
<h1>Soy un título grande</h1>
<p>Soy un párrafo de texto.</p>
```

La etiqueta `<h1>` abre el título y `</h1>` lo cierra.

## Haz tu primera página

1. Abre el **Bloc de notas**.
2. Copia este texto:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mi primera página</title>
</head>
<body>
  <h1>Hola, soy Frank</h1>
  <p>Esta es mi primera página web.</p>
</body>
</html>
```

3. Guárdalo con el nombre **index.html** (en "Tipo" elige *Todos los archivos*, para que no quede como `.txt`).
4. Haz doble clic en el archivo. Se abre en el navegador. **Esa es tu página.**

Para cambiarla: modifica el texto en el Bloc de notas, guarda y refresca el navegador (tecla F5).

También tienes un punto de partida listo en [`proyectos/01-mi-primera-pagina`](proyectos/01-mi-primera-pagina/index.html).

## Ejercicios

1. Cambia el título para que diga tu nombre completo.
2. Agrega una lista con tus 3 cosas favoritas, usando estas etiquetas:
   ```html
   <ul>
     <li>Primera cosa</li>
   </ul>
   ```
3. Agrega un enlace a tu página favorita: `<a href="https://www.wikipedia.org">Wikipedia</a>`
4. Agrega un segundo título más pequeño con `<h2>` y un párrafo sobre qué quieres crear cuando seas ingeniero.

<details>
<summary>Pista si algo no se ve</summary>

Revisa que cada etiqueta que abriste esté cerrada (`<li>` con su `</li>`). Y recuerda guardar el archivo antes de refrescar.

</details>

## Cuando termines

Marca el paso 3 en el [README](README.md).
