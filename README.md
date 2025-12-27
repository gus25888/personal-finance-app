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

## Próximos pasos

Lo que se encuentra después de este punto son elementos que faltan por implementar.

- CRUD completo para Movements y Categories.
- Integración con frontend
- Siguientes Epics listadas en `docs/backlog`

### Integración

## Notas sobre estructura del proyecto
