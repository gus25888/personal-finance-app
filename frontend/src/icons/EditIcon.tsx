import type { Props } from "./types";

export const EditIcon = ({ size = 16, className }: Props) => (
    /*
    Un SVG (Scalable Vector Graphics) es un dibujo hecho con vectores matemáticos, no con píxeles.

    Eso significa que el navegador dibuja líneas y curvas usando coordenadas.

    Por eso los iconos SVG:

    - no pierden calidad
    - se pueden escalar infinitamente
    - pesan muy poco.

    viewBox="minX minY width height"
        Significa: Dónde inicia (X e Y), ancho y largo del dibujo creado.
        Solo aplica como coordenadas internas, NO son pixeles.
        Determinan el tamaño de la "grilla" en que se dibujará.

    fill="currentColor"
        Esto hace que el SVG tome el color del texto del elemento padre, lo que permite estilizarlo con CSS.

    path:
        Es el dibujo en sí. Consiste en una instrucción que dice al navegador cómo dibujar líneas y curvas dentro del viewBox. La propiedad "d" significa "drawing commands". Algunos de los más comunes:

        Comando         Significado
        M               Move to (mover el lápiz)
        L               Line to (dibujar línea)
        H               línea horizontal
        V               línea vertical
        C               curva Bézier
        Z               cerrar forma
  */
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l10-10 3-3zM14 7.414l-9 9V19h2.586l9-9L14 7.414zm4 1.172L19.586 7 17 4.414 15.414 6 18 8.586z" />
    </svg>
);
