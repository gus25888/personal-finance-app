# Guía de contribución

Esta guía documenta las formas en que se debe realizar las contribuciones de este proyecto.

## Propósito del documento

El objetivo de este documento es definir el estilo de los commits que se realicen para poder registrar los cambios en el proyecto. Se dirige a cualquier desarrollador que tenga permisos de edición. Se espera que el desarrollador siga las directrices definidas en la sección "Convención de commits" para realizar commits y que estos sean realizados en las ramas definidas por la sección "Flujo de trabajo con ramas", con el objetivo de poder mantener un historial limpio y claro de los cambios realizados en el proyecto.

## Convención de commits

Los commits deben tener la siguiente estructura.

```git
 A: B.
 C.
```

 en donde:

- `B` corresponde a una frase que resuma los cambios realizados.
- `C` corresponde a la descripción más detallada de los cambios realizados, la cual puede ser de máximo 2 párrafos. Es opcional, si es que los cambios lo ameritan.
- `A`, corresponde a alguna de las siguientes categorías, descritas a continuación.

### Categorías de commits

  1. feat — Nueva funcionalidad
  2. fix — Corrección de un error
  3. chore — Tareas de mantenimiento (sin impacto en funcionalidad)
  4. refactor — Reestructuración del código sin cambiar su comportamiento
  5. style — Cambios que solo afectan la apariencia o el formato
  6. docs — Cambios en documentación
  7. test — Agregar o modificar pruebas
  8. perf — Mejoras de rendimiento
  9. build — Cambios en el proceso de compilación o bundling
  10. ci — Cambios en pipelines o integración continua

## Flujo de trabajo con ramas

- La rama main contiene el código estable y listo para producción.
- La rama dev se usa para el desarrollo activo y puede contener funcionalidades en progreso.
- Las nuevas funcionalidades se desarrollan directamente en dev o, opcionalmente, en ramas feature/* que luego se integran en dev.
- Un merge de dev a main debe realizarse solo cuando una fase completa del proyecto esté terminada y en estado estable.
