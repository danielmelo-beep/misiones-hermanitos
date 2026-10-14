"""Genera los iconos PNG de la app (instalacion en Android/iPhone) a partir del mismo dibujo de icon.svg.
Uso: python3 hacer-iconos.py   (requiere Pillow)"""
from PIL import Image, ImageDraw

S = 2048                     # se dibuja grande y se reduce para que los bordes queden suaves
K = S / 512


def gradiente(size):
    a, b = (0x22, 0xE4, 0xFF), (0xFF, 0x3D, 0x8B)
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return img


def dibujar(escala=1.0):
    """escala < 1 deja margen extra alrededor (icono 'maskable', que Android recorta en circulo)."""
    base = Image.new("RGB", (S, S), "#070A12")
    cx = cy = S / 2

    def p(x, y):
        return (cx + (x - 256) * K * escala, cy + (y - 256) * K * escala)

    hexa = [p(256, 92), p(388, 168), p(388, 320), p(256, 396), p(124, 320), p(124, 168)]
    mask = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(mask)
    d.line(hexa + [hexa[0]], fill=255, width=int(22 * K * escala), joint="curve")
    for v in hexa:
        r = 11 * K * escala
        d.ellipse((v[0] - r, v[1] - r, v[0] + r, v[1] + r), fill=255)
    base.paste(gradiente(S), (0, 0), mask)

    rayo = [p(278, 150), p(206, 270), p(260, 270), p(238, 362), p(320, 236), p(264, 236)]
    ImageDraw.Draw(base).polygon(rayo, fill="#B8FF3D")
    return base


def guardar(img, nombre, lado):
    img.resize((lado, lado), Image.LANCZOS).save(nombre, optimize=True)
    print("ok", nombre)


normal = dibujar(1.0)
segura = dibujar(0.78)
guardar(normal, "icon-192.png", 192)
guardar(normal, "icon-512.png", 512)
guardar(normal, "apple-touch-icon.png", 180)
guardar(segura, "icon-maskable-512.png", 512)
