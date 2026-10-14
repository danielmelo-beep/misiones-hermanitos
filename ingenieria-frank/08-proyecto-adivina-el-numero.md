# Paso 8 · Proyecto: Adivina el número

## El reto

Vas a crear tu primer juego. El computador "piensa" un número del 1 al 100 y tú debes adivinarlo. Después de cada intento, el juego te dice si te pasaste o te quedaste corto.

Usa todo lo que aprendiste: entrada, proceso y salida (paso 1), algoritmo (paso 2), una página con HTML (paso 3), un botón con JavaScript (paso 4), variables y decisiones (paso 5).

## Primero, juega

Abre en el navegador el archivo [`proyectos/02-adivina-el-numero/index.html`](proyectos/02-adivina-el-numero/index.html). Ya funciona. Juégalo varias veces.

## Ahora, léelo

Ábrelo con el Bloc de notas y busca estas piezas. Escribe en un papel dónde está cada una:

1. **La entrada:** ¿dónde escribe el jugador su número?
2. **Una variable:** ¿cuál guarda el número secreto?
3. **Una decisión:** ¿dónde compara el número del jugador con el secreto?
4. **La salida:** ¿dónde se muestra el mensaje?

## Y ahora, mejóralo

Elige las mejoras que quieras. Hazlas de a una y prueba después de cada una:

1. Que el título diga tu nombre: "El juego de Frank".
2. Que, al ganar, el mensaje use tu nombre: "¡Lo lograste, Frank!".
3. Que el jugador tenga **solo 7 intentos**. Si se acaban, que diga cuál era el número.
4. Que el juego se pueda **reiniciar** con un botón "Jugar de nuevo".
5. Que muestre los números que ya intentó el jugador.
6. **Reto grande:** que lleve la cuenta de cuántas partidas ganaste.

<details>
<summary>Pista para limitar los intentos</summary>

Ya existe una variable `intentos` que cuenta cada vez. Después de sumarle 1, agrega una decisión: `if (intentos >= 7 && numero !== secreto)`, y ahí dices que perdió y cuál era el número.

</details>

<details>
<summary>Pista para reiniciar</summary>

Reiniciar significa volver a pensar un número y poner los intentos en 0. Crea una función con esos dos pasos y llámala desde un botón nuevo.

</details>

## Cuando termines

Marca el paso 8 en el [README](README.md) y haz un commit con tu juego mejorado.

Acabas de crear una página web y un juego. Todo ingeniero de sistemas empezó exactamente así. El siguiente paso es el que tú elijas: otro juego, una app para algo que te importe o una mejora para tu propia app de Misiones.
