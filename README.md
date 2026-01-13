# App de Finanzas Personales

Una aplicación desarrollada para permitir el manejo de mis finanzas personales.

## Requisitos Previos

Para poder iniciar este proyecto es necesario tener instalado Docker Desktop, en su última versión.

## Configuración del entorno

Para la configuración del entorno se debe generar un archivo `.env` dentro del directorio `backend/docker`, en el cual se deben registrar las variables definidas en el archivo `.env.template`.

## Levantamiento de la base de datos en desarrollo

Con las configuraciones implementadas se debe proceder a abrir Docker Desktop y luego una terminal de comandos y ejecutar lo siguiente:

```sh
cd backend/docker
docker compose -f docker-compose.dev.yml up -d
```

> NOTA: El comando anterior solo se debe ejecutar la primera vez para crear el contenedor. Las siguientes iniciará automáticamente al abrir Docker Desktop.

## Validación de la conexión

Para poder validar la conexión, se puede abrir otra ventana terminal, y ejecutar los siguientes comandos:

```sh
docker exec -it pfa-db-dev psql -U POSTGRES_USER POSTGRES_DB

postgres=# \conninfo
```

Si se obtiene un mensaje "You are connected to database...", la base de datos ha sido levantada correctamente.

### Definición del modelo de datos

El modelo de datos se encuentra definido conceptualmente en `docs/data-model.md`.

Por otro lado, se encuentra definido de forma técnica como migraciones, las cuales están definidas en el directorio `backend/src/migrations`.

### Backend

Este sección contiene las especificaciones técnicas de la base de datos, además, de la funcionalidad levantada para poder gestionar los datos de la base de datos.

#### Stack tecnológico utilizado en backend

- NestJS
- TypeORM
- PostgreSQL
- Docker
- Swagger

#### Configuración del entorno backend

Para la configuración del entorno se debe generar un archivo `.env` dentro del directorio `backend`, en el cual se deben registrar las variables definidas en el archivo `.env.template` ubicado en el mismo directorio.

Luego, se debe ejecutar el comando `npm install` para poder instalar todas las dependencias del proyecto.

#### Levantamiento del entorno en desarrollo

Para levantar la aplicación se requiere tener la base de datos corriendo según lo descrito en la sección "Levantamiento de la base de datos en desarrollo" y luego hacer uso del comando `npm run start:dev` desde el directorio `backend`.

#### Endpoints implementados

Los endpoints implementados están documentados a través de Swagger, el cual se encuentra accesible a través del navegador en la dirección [/api](http://localhost:3000/api), cuando la aplicación se encuentra funcionando.

### Migraciones de Base de Datos

Este proyecto utiliza TypeORM para la gestión de migraciones de base de datos.

Debido a limitaciones actuales del ecosistema (Node.js en modo ESM + TypeORM CLI), las migraciones no se ejecutan directamente sobre JavaScript compilado, sino mediante el paquete `typeorm-ts-node-commonjs`, el cual permite ejecutar migraciones escritas en TypeScript de forma estable. Se usó de ejemplo, este [tutorial](https://dev.to/brngranado/how-handler-migrations-in-nestjs-in-an-effective-way-using-typeorm-24da).

#### Consideraciones importantes

Las migraciones se definen y versionan en el directorio src/migrations.

El archivo `data-source.ts`:

- solo se utiliza para la ejecución de migraciones
- no forma parte del runtime de la aplicación NestJS
- no debe ser importado ni usado dentro de módulos o servicios

Esta decisión es intencional y pragmática, orientada a evitar conflictos entre ESM y CommonJS durante la ejecución del CLI.

#### Ejecución de migraciones

Se han generado una serie de comandos npm para poder realizar todas las actividades necesarias:

```sh
# Desde el directorio backend:

# Create: Usado para generar la estructura vacía para una nueva migración. Permite definir manualmente los cambios a realizar.
npm run migrations:create --name=<migration-name>

# Generate: Usado para generar una nueva migración basado en los cambios de entities y la comparación con el estado de la base de datos.
npm run migrations:generate --name=<migration-name>

# Run: Usado para ejecutar las migraciones pendientes.
npm run migrations:run

# Revert: Usado para revertir la última migración ejecutada.
npm run migrations:revert

# Show: Usado para revisar el status de las migraciones realizadas.
npm run migrations:show
```

### Integración con frontend

## Notas de diseño y decisiones arquitectónicas

En esta sección se describen las decisiones tomadas en el proyecto tanto a nivel técnico como de reglas de negocio.

### Decisiones de diseño relevantes

#### Estrategia de testing

El backend cuenta solo con unit testing de la entidad Category, debido a que se consideró como la más "compleja" de las implementadas.

Solo se probaron las funcionalidades más complejas del mismo, a saber:

- Update: Por su uso de múltiples dependencias, uso de reglas de dominio condicionales y manejo de flujos condicionales.

- Delete: Por lo descrito en Update y sumado a la existencia de soft-delete para la entidad.

Movements no fue incluida como parte de las pruebas en el MVP, debido a que no aporta valor didáctico adicional a los tests ya implementados.

#### Separación entre Services y Rules

Categories cuenta con una implementación separada de Rules para la definición de restricciones derivadas de las reglas de negocio definidas para la entidad. Esto fue realizado para poder mantener un orden de las funcionalidades, ya que el Service cuenta con las funcionalidades que realizan manipulación de los datos de la entidad y las Rules determinan si es factible realizar estas acciones dependiendo de los datos.

En el caso de Categories, sus restricciones dependen de si tiene algún movimiento asociado, por lo que realizar la separación permite dejar más claro el objetivo de las reglas definidas, sin mezclar con funcionalidades de otra entidad. Las reglas implementadas corresponden a la posibilidad de cambiar el tipo o de borrar la categoría.

Para Movements, la separación podría ser implementada pero no se realizó debido a que las restricciones definidas no afectan a nada más fuera del service, por lo que no se quiso hacer solo por simplicidad respecto al alcance del MVP.

#### Uso de soft-delete

En el proyecto, Categories hace uso de soft-delete, con el objetivo de poder mantener la consistencia histórica de los datos. En caso de que se evalúe que una Category ya no es relevante o válida, puede ser excluida para nuevos Movements sin afectar a los registros ya creados. Para identificar si una Category fue eliminada, se debe mirar su columna deletedAt: si tiene algún valor registrado, esa Category fue eliminada, es decir, ya no es válida.

Por otro lado, Movements **no** hace uso de soft-delete, sin embargo, tienes otras reglas definidas al respecto.

#### Manejo de fechas y reglas temporales

El registro de información de manipulación de datos (createdAt, updatedAt, deletedAt) usa timestamps para el registro, por razones de conveniencia en el desarrollo.

Las fechas restantes solo consideran el día actual para tomar decisiones. Estas incluyen:

- Días para permitir el borrado / actualización de un registro de Movement.
- Días mínimos y máximos para definir en la fecha de un Movement.

#### Otras reglas de dominio

Para Movements existen tres reglas definidas que dependen de su amount:

- Mínimo = 500
- Máximo = 99999999
- Múltiplo = 500

#### Alcance del MVP y no-objetivos

El MVP incluye la implementación de CRUD de las dos entidades: Categories y Movements. Esta última cuenta con una complejidad un poco mayor en su obtención de múltiples datos, ya que se implementaron filtros tales como:

- Fecha Desde y Fecha Hasta
- Contenido completo de la descripción
- Categoría
- Tipo de Categoría

Lo que se pretende implementar más adelante, incluye la búsqueda de movimientos por partes de la descripción y nuevos endpoints para poder obtener totales por categorías para la implementación de reportes o gráficos.

## Próximos pasos

Lo que se encuentra después de este punto son elementos que faltan por implementar.

- Integración con frontend
- Siguientes Epics listadas en `docs/backlog`
