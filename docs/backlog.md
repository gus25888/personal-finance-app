# 📘 Backlog del Proyecto — Finanzas Personales

Este documento registra las funcionalidades y tareas previstas para la evolución del proyecto.
Las **EPICs están ordenadas por prioridad**, donde la **EPIC 0** corresponde a la infraestructura base necesaria para habilitar el MVP completo.

Cada tarea incluye categorías para identificar el área de impacto:

**Categorías:**

- **FE:** Frontend
- **BE:** Backend
- **DB:** Base de datos
- **DOC:** Documentación
- **QA:** Pruebas
- **FUN:** Definición funcional (análisis/reportes no técnicos)

---

## 🧩 EPIC 0 — Infraestructura Base del MVP

### Tarea 0.1 — Definición funcional del backend del MVP

**Categorías:** FUN

- 0.1.1 — Definir qué datos debe manejar el backend
- 0.1.2 — Definir operaciones mínimas necesarias
- 0.1.3 — Definir validaciones funcionales básicas

### Tarea 0.2 — Análisis conceptual del modelo de datos

**Categorías:** DB, FUN

- 0.2.1 — Identificar entidades necesarias para el MVP
- 0.2.2 — Definir relaciones funcionales entre entidades

### Tarea 0.3 — Diseño técnico del modelo de datos

**Categorías:** DB, BE

- 0.3.1 — Definir estructura técnica de cada tabla
- 0.3.2 — Definir claves primarias y foráneas
- 0.3.3 — Definir tipos de datos y restricciones
- 0.3.4 — Definir integridad referencial
- 0.3.5 — Revisar normalización mínima necesaria

### Tarea 0.4 — Implementación técnica de la base de datos

**Categorías:** DB

- 0.4.1 — Crear scripts SQL para las tablas necesarias
- 0.4.2 — Añadir constraints e índices mínimos
- 0.4.3 — Validar creación en PostgreSQL
- 0.4.4 — Ajustes según pruebas

### Tarea 0.5 — Configuración inicial del backend

**Categorías:** BE

- 0.5.1 — Configurar proyecto backend (estructura base)
- 0.5.2 — Configurar variables de entorno
- 0.5.3 — Configurar conexión a la base de datos

### Tarea 0.6 — Implementación del CRUD de Movimientos (backend)

**Categorías:** BE

- 0.6.1 — Implementar operaciones CRUD de movimientos
- 0.6.2 — Agregar validaciones básicas
- 0.6.3 — Manejar errores mínimos

### Tarea 0.7 — Integración Frontend ↔ Backend

**Categorías:** FE, BE

- 0.7.1 — Consumir API desde el frontend
- 0.7.2 — Adaptar formularios y tabla a datos reales
- 0.7.3 — Manejo de estados de carga y errores

### Tarea 0.8 — Pruebas del MVP (end-to-end)

**Categorías:** QA, FE, BE

- 0.8.1 — Pruebas funcionales en frontend
- 0.8.2 — Pruebas unitarias o funcionales en backend
- 0.8.3 — Validación FE/BE integrada

### 🎨 Tarea 0.9 — Mejora visual de botones de acción

**Categorías:** FE, UI

Objetivo: reemplazar los botones de acción actuales (editar / eliminar) que usan letras por iconos más claros y mejorar su presentación visual.

#### Subtareas

- 0.9.1 — Definir iconos a utilizar
  - Editar → ✏️
  - Eliminar → 🗑️
  - Usar caracteres Unicode o SVG simples.

- 0.9.2 — Reemplazar contenido de botones en la tabla de Movements
  - Actualizar botones de editar
  - Actualizar botones de eliminar

- 0.9.3 — Reemplazar contenido de botones en la tabla de Categories (si aplica)

- 0.9.4 — Ajustar estilos CSS de botones de acción
  - Tamaño consistente
  - Padding adecuado
  - Cursor pointer
  - Hover visual

- 0.9.5 — Validar accesibilidad básica
  - Agregar atributo `title` en los botones
  - Ejemplo:
    - title="Editar movimiento"
    - title="Eliminar movimiento"

---

### Tarea 0.10 — Formateo de fechas y montos

**Categorías:** FE

Objetivo: mejorar la presentación de los datos financieros usando formatos legibles para el usuario.

#### Subtareas 0.10

- 0.10.1 — Crear utilidades de formato
  - Crear archivo `formatters.ts` o `utils/formatters.ts`

- 0.10.2 — Implementar función de formateo de fechas
  - Usar `Intl.DateTimeFormat`
  - Formato esperado: `dd/mm/yyyy`

- 0.10.3 — Implementar función de formateo de montos
  - Usar `Intl.NumberFormat`
  - Moneda local
  - Separadores de miles

- 0.10.4 — Aplicar formato en el reporte de Movements
  - Fecha
  - Monto

- 0.10.5 — Aplicar formato en la sección de Totales

- 0.10.6 — Validar consistencia visual
  - Alineación correcta de montos en tabla
  - No mostrar valores sin formato

---

### Tarea 0.11 — Pruebas básicas de Frontend

**Categorías:** QA, FE

Objetivo: asegurar que los componentes principales funcionen correctamente tras la integración con el backend.

#### Subtareas 0.11

- 0.11.1 — Configurar entorno de pruebas
  - Usar `Vitest`
  - Usar `Testing Library` para React

- 0.11.2 — Crear pruebas de renderizado de componentes principales
  - MovementList
  - MovementForm
  - CategoriesList (si aplica)

- 0.11.3 — Probar renderizado con datos
  - Mockear respuesta del backend
  - Verificar que la tabla muestra registros

- 0.11.4 — Probar acciones básicas del usuario
  - Crear movimiento
  - Eliminar movimiento

- 0.11.5 — Validar integración con hooks
  - Verificar que los hooks cargan datos al montar el componente

- 0.11.6 — Ejecutar pruebas y corregir errores detectados

---

### Tarea 0.12 — Validación final del MVP

**Categorías:** QA, FE, BE

Objetivo: verificar que el sistema completo funciona correctamente antes de cerrar el hito.

#### Subtareas 0.12

- 0.12.1 — Crear movimiento
- 0.12.2 — Editar movimiento
- 0.12.3 — Eliminar movimiento
- 0.12.4 — Crear categoría
- 0.12.5 — Editar categoría
- 0.12.6 — Eliminar categoría
- 0.12.7 — Validar cálculo de totales
- 0.12.8 — Validar formato visual de datos
- 0.12.9 — Validar integración completa frontend ↔ backend

---

## 🧩 EPIC 1 — Calculadora de Dinero Real

### Tarea 1.1 — Definición funcional de la calculadora

**Categorías:** FUN

- 1.1.1 — Definir denominaciones a usar
- 1.1.2 — Definir reglas del cálculo de efectivo
- 1.1.3 — Definir qué tarjetas incluir
- 1.1.4 — Definir comparación con saldo de movimientos
- 1.1.5 — Definir estados del resultado

### Tarea 1.2 — Diseño funcional del flujo de usuario

**Categorías:** FUN

- 1.2.1 — Definir entradas necesarias
- 1.2.2 — Definir salidas y estructura del resultado
- 1.2.3 — Definir comportamiento ante entradas inválidas

### Tarea 1.3 — Diseño UI

**Categorías:** FE, FUN

- 1.3.1 — Definir componentes de interacción
- 1.3.2 — Definir layout
- 1.3.3 — Definir estados visuales

### Tarea 1.4 — Análisis de requerimientos backend

**Categorías:** BE, DB, FUN

- 1.4.1 — Identificar datos que deben persistir
- 1.4.2 — Definir validaciones funcionales

### Tarea 1.5 — Implementación

**Categorías:** FE, BE, DB, QA

- 1.5.1 — Implementación frontend
- 1.5.2 — Implementación backend
- 1.5.3 — Persistencia
- 1.5.4 — Pruebas

---

## 🧩 EPIC 2 — Historial de Conciliaciones

### Tarea 2.1 — Definición funcional

**Categorías:** FUN

- 2.1.1 — Definir datos a guardar
- 2.1.2 — Definir filtros por fecha
- 2.1.3 — Definir orden del historial

### Tarea 2.2 — Diseño UI

**Categorías:** FE, FUN

- 2.2.1 — Vista del historial
- 2.2.2 — Vista de detalles por registro

### Tarea 2.3 — Análisis backend

**Categorías:** BE, DB, FUN

- 2.3.1 — Identificar estructura de persistencia
- 2.3.2 — Definir reglas de almacenamiento

### Tarea 2.4 — Implementación

**Categorías:** FE, BE, DB, QA

- 2.4.1 — Implementación frontend
- 2.4.2 — Implementación backend
- 2.4.3 — Pruebas

---

## 🧩 EPIC 3 — Reportes por Categoría y Mes

### Tarea 3.1 — Definición funcional

**Categorías:** FUN

- 3.1.1 — Definir métricas requeridas
- 3.1.2 — Definir filtros
- 3.1.3 — Definir estructura del reporte

### Tarea 3.2 — Diseño de visualización

**Categorías:** FE, FUN

- 3.2.1 — Evaluar necesidad de gráficos
- 3.2.2 — Definir presentación visual

### Tarea 3.3 — Análisis backend

**Categorías:** BE, DB, FUN

- 3.3.1 — Identificar cálculos necesarios
- 3.3.2 — Identificar datos requeridos

### Tarea 3.4 — Implementación

**Categorías:** FE, BE, QA

- 3.4.1 — Implementación frontend
- 3.4.2 — Implementación backend
- 3.4.3 — Pruebas

---

## 🧩 EPIC 4 — Descripciones Comunes / Registro Rápido

### Tarea 4.1 — Definición funcional

**Categorías:** FUN

- 4.1.1 — Definir estructura de descripciones
- 4.1.2 — Definir flujo de selección durante registro

### Tarea 4.2 — Diseño UI

**Categorías:** FE, FUN

- 4.2.1 — Interfaz de uso rápido

### Tarea 4.3 — Análisis de persistencia

**Categorías:** BE, DB, FUN

- 4.3.1 — Identificar datos a almacenar

### Tarea 4.4 — Implementación

**Categorías:** FE, BE, QA

- 4.4.1 — Frontend
- 4.4.2 — Backend

---

## 🧩 EPIC 5 — Registro de Préstamos

### Tarea 5.1 — Definición funcional

**Categorías:** FUN

- 5.1.1 — Definir proceso de préstamo
- 5.1.2 — Definir proceso de devolución
- 5.1.3 — Definir estados del préstamo

### Tarea 5.2 — Diseño UI

**Categorías:** FE, FUN

- 5.2.1 — Definir vistas necesarias

### Tarea 5.3 — Análisis de datos

**Categorías:** BE, DB, FUN

- 5.3.1 — Identificar información a persistir

### Tarea 5.4 — Implementación

**Categorías:** FE, BE, QA

- 5.4.1 — Frontend
- 5.4.2 — Backend
- 5.4.3 — Pruebas
