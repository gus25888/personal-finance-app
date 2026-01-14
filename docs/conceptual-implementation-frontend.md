# Implementación conceptual del frontend

Este documento describe **cómo se implementará conceptualmente el frontend** del proyecto *Finanzas Personales*, a partir de las decisiones de diseño acordadas durante la fase conceptual.

El objetivo es servir como **guía directa para la implementación en código**, evitando improvisaciones y manteniendo coherencia arquitectónica.

---

## 1. Objetivo de la arquitectura frontend

* Integrar el frontend con un backend REST real.
* Mantener la UI desacoplada del backend.
* Permitir que el dominio frontend evolucione sin depender de detalles técnicos.
* Facilitar cambios futuros (nuevas entidades, auth, nuevos endpoints).

---

## 2. Capas definidas en el frontend

El frontend se divide en **capas conceptuales claras**, cada una con una responsabilidad única.

### 2.1 Capa de Presentación (UI)

**Responsabilidad**:

* Renderizar la interfaz.
* Manejar estados visuales (loading, error, vacío).
* Iniciar acciones asincrónicas (ej: cargar movimientos).

**Qué conoce**:

* Services de dominio.
* Tipos de dominio frontend (`Movement`, `Category`).

**Qué NO conoce**:

* HTTP.
* URLs.
* DTOs del backend.
* Mappers.

---

### 2.2 Dominio Frontend (Services por entidad)

Ejemplos:

* `movements`
* `categories` (futuro)

**Responsabilidad**:

* Exponer operaciones del dominio frontend.
* Orquestar llamadas a infraestructura.
* Aplicar mappers.
* Devolver datos listos para la UI.

**Qué conoce**:

* Capa HTTP (como abstracción).
* Mappers de su entidad.
* Tipos de dominio frontend.

**Qué NO conoce**:

* Componentes.
* Detalles de UI.
* Implementación concreta de HTTP.

---

### 2.3 Mappers (Adapters por entidad)

**Responsabilidad**:

* Traducir datos entre:

  * DTOs del backend
  * modelos de dominio frontend

**Características**:

* Específicos por entidad.
* Sin estado.
* Funciones puras.

**Qué NO hacen**:

* Llamadas HTTP.
* Manejo de errores.
* Decisiones de UI.

---

### 2.4 Infraestructura (HTTP)

**Responsabilidad**:

* Ejecutar requests HTTP.
* Interpretar códigos de estado.
* Normalizar errores (4xx vs 5xx).

**Qué conoce**:

* Tecnología (`fetch`).
* Configuración (URL base, headers).

**Qué NO conoce**:

* Dominio (`movements`, `categories`).
* UI.
* Mappers.

---

### 2.5 Configuración

**Responsabilidad**:

* Definir valores de entorno (API URL, flags).

**Características**:

* Independiente del dominio.
* Usada por infraestructura.

---

## 3. Tipos y modelos

### 3.1 Tipos de dominio frontend

* Representan cómo la UI entiende el negocio.
* Ejemplos: `Movement`, `Category`.
* Son estables.
* No deben cambiar si cambia el backend.

Estos tipos pertenecen conceptualmente al **dominio frontend**.

---

### 3.2 Tipos técnicos / DTOs

* Representan la forma de los datos del backend.
* Son volátiles.
* Se usan solo en services y mappers.
* Nunca se exponen a la UI.

---

## 4. Flujo de datos – `GET /movements`

1. Un componente de presentación se monta.
2. El componente invoca un service de dominio (`movements`).
3. El service llama a la capa HTTP.
4. La capa HTTP:

   * ejecuta la request,
   * interpreta errores HTTP,
   * devuelve datos o lanza error normalizado.
5. El service aplica el mapper correspondiente.
6. El componente recibe:

   * una lista de `Movement`, o
   * un error de aplicación.

---

## 5. Manejo de errores

### Criterio acordado

* **Errores 4xx**:

  * el backend describe el problema,
  * el mensaje puede mostrarse al usuario.

* **Errores 5xx**:

  * no se expone detalle técnico,
  * se muestra un mensaje genérico.

### Flujo de errores

* Nacen en la capa HTTP.
* Se propagan a través de services.
* Se presentan en la UI.

---

## 6. Reglas de dependencia

### Dependencias permitidas

* Presentación → Services de dominio
* Services → Infraestructura (HTTP)
* Services → Mappers
* Mappers → Tipos técnicos y tipos de dominio
* Infraestructura → Configuración

### Dependencias prohibidas

* Presentación → HTTP / DTOs / Mappers
* Services → UI
* Infraestructura → Dominio / UI
* Mappers → HTTP / UI

---

## 7. Regla de oro del diseño

> Si una capa necesita información de otra para decidir qué hacer, la responsabilidad está mal ubicada.

---

Este documento define **la base de implementación del frontend para este proyecto** y debe usarse como referencia al escribir código.
