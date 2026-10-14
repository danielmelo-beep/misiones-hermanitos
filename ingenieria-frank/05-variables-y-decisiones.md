# Paso 5 · Variables y decisiones

## Variables: cajas con nombre

Una **variable** es una caja con nombre donde guardas un dato para usarlo después.

```js
let nombre = "Frank";
let puntos = 30;
```

`nombre` guarda un texto y `puntos` guarda un número. Puedes cambiar lo que hay dentro:

```js
puntos = puntos + 10;   // ahora puntos vale 40
```

Es lo mismo que hace tu app con el XP: cada misión suma XP a una variable.

## Decisiones: si... entonces...

Con `if` el programa elige qué hacer según una condición:

```js
if (puntos >= 100) {
  alert("¡Subiste de nivel!");
} else {
  alert("Te faltan " + (100 - puntos) + " puntos.");
}
```

Los símbolos para comparar son: `>` mayor, `<` menor, `>=` mayor o igual, `<=` menor o igual, `===` igual.

## Un programa que te saluda

Pon esto dentro de un `<script>` en tu página:

```html
<script>
let nombre = prompt("¿Cómo te llamas?");
let edad = Number(prompt("¿Cuántos años tienes?"));

if (edad >= 13) {
  alert("Hola, " + nombre + ". Ya eres adolescente.");
} else {
  alert("Hola, " + nombre + ". Todavía eres un niño.");
}
</script>
```

`prompt` le hace una pregunta a quien usa la página (entrada). El `if` decide (proceso). `alert` muestra la respuesta (salida).

## Ejercicios

1. Cambia el mensaje de `alert` para que diga algo que te guste.
2. Agrega una pregunta nueva: "¿Cuál es tu comida favorita?" y muestra una frase que la use.
3. Escribe un programa que pregunte "¿Cuánto es 7 × 8?" y diga "¡Correcto!" si la respuesta es 56, o "Casi, inténtalo de nuevo" si no.
4. **Reto:** que el programa pregunte la hora (de 0 a 23) y diga "Buenos días" antes de las 12, "Buenas tardes" antes de las 19 y "Buenas noches" en cualquier otro caso. Así saluda tu app de Misiones.

<details>
<summary>Pista del ejercicio 4</summary>

Usa un `if`, luego un `else if` y al final un `else`:

`if (hora < 12) {...} else if (hora < 19) {...} else {...}`

</details>

## Cuando termines

Marca el paso 5 en el [README](README.md).
