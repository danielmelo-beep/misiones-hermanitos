# Paso 6 · Repeticiones

## La idea

A los computadores les encanta repetir cosas sin cansarse. Para eso existe el **ciclo** (o *bucle*).

```js
for (let i = 1; i <= 5; i++) {
  console.log("Vuelta número " + i);
}
```

Cómo se lee:

- `let i = 1`: empieza contando en 1.
- `i <= 5`: sigue mientras `i` sea menor o igual a 5.
- `i++`: en cada vuelta, suma 1 a `i`.

Es la tercera pieza de los algoritmos del paso 2: la **repetición**.

## Dónde ver los resultados

`console.log` escribe en la **consola** del navegador. Para verla:

1. Abre tu página.
2. Presiona **F12**.
3. Entra a la pestaña **Consola** (o *Console*).

## La tabla del 7, hecha por el computador

```html
<script>
for (let i = 1; i <= 10; i++) {
  console.log("7 x " + i + " = " + (7 * i));
}
</script>
```

Guarda, refresca y mira la consola. Tardaste 10 segundos en escribirlo y el computador hizo las 10 cuentas. Eso es automatizar.

## Ejercicios

1. Cambia el programa para que muestre la **tabla del 9**.
2. Haz una **cuenta regresiva** de 10 a 1 y que al final muestre "¡Despegue!".
3. Escribe un ciclo que muestre solo los números **pares** del 2 al 20.
4. **Reto:** que muestre todas las tablas, del 2 al 9, una debajo de otra. Pista: un ciclo dentro de otro ciclo.

<details>
<summary>Pista del ejercicio 2</summary>

Para contar hacia atrás, empieza en 10, sigue mientras `i >= 1` y en vez de `i++` usa `i--`. El mensaje final va **después** del ciclo, afuera de las llaves.

</details>

<details>
<summary>Pista del ejercicio 3</summary>

Empieza en 2 y en cada vuelta suma 2: `i = i + 2`.

</details>

## Cuando termines

Marca el paso 6 en el [README](README.md).
