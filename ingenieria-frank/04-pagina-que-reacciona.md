# Paso 4 · Hacer que la página haga cosas

## La idea

El HTML dice **qué hay** en la página. Para que la página **haga** cosas (responder a un clic, cambiar un texto) se usa otro lenguaje: **JavaScript**.

Es el mismo lenguaje que hace funcionar tu app de Misiones.

## Un botón que saluda

Agrega esto dentro del `<body>` de tu página:

```html
<button onclick="saludar()">Saludar</button>
<p id="saludo"></p>

<script>
function saludar() {
  document.getElementById("saludo").textContent = "¡Hola, mundo!";
}
</script>
```

Guarda, refresca y toca el botón.

Qué pasó, paso a paso:

1. Tocaste el botón (**entrada**).
2. El botón llamó a la función `saludar()`. Una **función** es un grupo de pasos con nombre.
3. La función buscó el párrafo con `id="saludo"` y le puso un texto nuevo (**proceso**).
4. El texto apareció en pantalla (**salida**).

Es el mismo patrón del paso 1: entrada, proceso, salida.

## Ejercicios

1. Cambia el mensaje para que diga "Hola, soy Frank".
2. Cambia la palabra del botón: en vez de "Saludar", que diga "Tócame".
3. Agrega un **segundo botón** que, al tocarlo, ponga otro mensaje en el mismo párrafo.
4. **Reto:** haz que otro botón borre el mensaje (pista: un texto vacío es `""`).

<details>
<summary>Pista del ejercicio 3</summary>

Necesitas una segunda función con otro nombre, por ejemplo `despedir()`, y un segundo botón con `onclick="despedir()"`.

</details>

## Cuando termines

Marca el paso 4 en el [README](README.md).
