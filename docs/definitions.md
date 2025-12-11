# Aplicación de Finanzas Personales (MVP)

Este documento consolida la información del proyecto **Finanzas Personales**, ajustado al estado actual de desarrollo y al backlog vigente. Sirve como referencia base para planificación, decisiones técnicas y comunicación del proyecto dentro del repositorio.

---

## 📌 Descripción del Proyecto

Aplicación web desarrollada con **React + TypeScript** en el frontend y **Node.js + Express + PostgreSQL** en el backend.

El objetivo es construir un sistema para registrar, consultar y analizar movimientos financieros personales, con una evolución incremental desde un MVP hasta una aplicación completa.

La aplicación actualmente contempla:

- Registro de ingresos y egresos
- Categorías predefinidas
- Validaciones básicas
- Integración FE ↔ BE en fase de diseño

---

## 🎯 Objetivos del Proyecto

- Practicar un stack completo: **React + TypeScript + Node + PostgreSQL**
- Aplicar buenas prácticas de arquitectura y versionado
- Desarrollar un roadmap escalable con funcionalidades reales
- Mantener documentación clara y actualizada dentro del repositorio
- Evolucionar hacia un backend completamente funcional y persistente

---

## 🗺️ Roadmap General

### **Fase 1 — MVP Frontend (completada parcialmente)**

- [x] Estructura base del proyecto React
- [x] Tipos de dominio: `Movement`, `Category`, `MovementType`
- [x] Formulario de movimientos
- [x] Tabla de movimientos
- [ ] Estilos iniciales
- [ ] Validaciones adicionales

### **Fase 2 — Backend + Base de Datos (en progreso)**

- [x] Análisis funcional del backend
- [x] Diseño del modelo de datos (según backlog)
- [ ] Implementación de tablas en PostgreSQL
- [ ] Configuración inicial del backend (Express)
- [ ] Implementación CRUD de movimientos

### **Fase 3 — Integración Frontend ↔ Backend**

- [ ] Consumo de API real desde el frontend
- [ ] Adaptación de formulario y tabla a datos persistentes
- [ ] Manejo de errores, carga y estados vacíos

### **Fase 4 — Funcionalidades Adicionales**

- Filtros por categoría y tipo
- Ordenamiento
- Totales
- Reportes por categoría y mes
- Registro rápido
- Historial de conciliaciones

(Para más detalle consultar **/docs/backlog.md**)

---

## 🧱 Arquitectura del Proyecto

### **Frontend — React + TypeScript**

- Basado en componentes reutilizables
- Manejo de estado local por ahora
- Consumirá el backend vía API REST
- Tipos de dominio organizados en `/types`
- Datos estáticos en `/data` (solo para el MVP)

```ts
src/
  components/
    MovementForm.tsx
    MovementList.tsx
  data/
    categories.ts
  types/
    index.ts
  styles/
  App.tsx
  main.tsx
```

### **Backend — Node.js + Express**

- Estructura modular propuesta:

```ts
backend/
  app.js
  index.js
  controllers/
  models/
  services/
  utils/
    config.js
    logger.js
    middleware.js
  db/
    schema.sql
```

### **Base de Datos — PostgreSQL**

Entidades principales:

- **movements**
- **categories**

Seguir definiciones detalladas en backlog (EPIC 0).

---

## 🔗 Integración FE ↔ BE (Planeada)

La comunicación entre capas será mediante API REST.

Operaciones mínimas del MVP (según backlog):

- GET /movements
- POST /movements
- PUT /movements/:id
- DELETE /movements/:id
- GET /categories

Estas rutas serán consumidas por el frontend mediante un módulo de servicios.

---

## 📘 Eliminación de funcionalidades obsoletas

Originalmente se consideraba persistir datos usando **localStorage**.
**Esta estrategia fue descartada** porque el proyecto evolucionó hacia un backend real.

En consecuencia:

- No se implementará lógica de `saveMovements()` ni `loadMovements()` en localStorage.
- La persistencia oficial será exclusivamente vía PostgreSQL.
- La sincronización FE ↔ BE reemplaza cualquier manejo local.

Este documento ya no incluye secciones relacionadas a localStorage.

---

## 🧩 Backlog Resumido

El backlog completo está disponible en el archivo `docs/backlog.md`.
Aquí solo se listan las EPICs:

- **EPIC 0:** Infraestructura base del MVP (BD, Backend, CRUD, Integración)
- **EPIC 1:** Calculadora de Dinero Real
- **EPIC 2:** Historial de Conciliaciones
- **EPIC 3:** Reportes por Categoría y Mes
- **EPIC 4:** Descripciones Comunes
- **EPIC 5:** Registro de Préstamos

---

## 📜 Notas Finales

Este documento debe mantenerse actualizado cada vez que:

- se completen milestones importantes,
- se agreguen funcionalidades al backlog,
- se modifique arquitectura,
- o se generen nuevas decisiones técnicas.

Es parte fundamental de la documentación viva del proyecto y acompañará la evolución hacia las siguientes versiones.
