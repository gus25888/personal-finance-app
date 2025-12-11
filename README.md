# App de Finanzas Personales

Una aplicación desarrollada para permitir el manejo de mis finanzas personales.

## Requisitos Previos

Para poder iniciar este proyecto es necesario tener instalado Docker Desktop, en su última versión.

## Configuración del entorno

Para la configuración del entorno se debe generar un archivo `.env` dentro del directorio `backend/docker`, en el cual se deben registrar las variables definidas en el archivo `.env.template`.

## Levantamiento de la base de datos en desarrollo

Con las configuraciones implementadas se debe proceder a abrir una terminal de comandos y ejecutar lo siguiente:

```sh
cd backend/docker
docker compose -f docker-compose.dev.yml up -d
```

## Validación de la conexión

Para poder validar la conexión, se puede abrir otra ventana terminal, y ejecutar los siguientes comandos:

```sh
docker exec -it pfa-db-dev psql -U POSTGRES_USER POSTGRES_DB

postgres=# \conninfo
```

Si se obtiene un mensaje "You are connected to database...", la base de datos ha sido levantada correctamente.

## Próximos pasos

### Definición del modelo de datos

### Migraciones

### Backend

### Integración

## Notas sobre estructura del proyecto
