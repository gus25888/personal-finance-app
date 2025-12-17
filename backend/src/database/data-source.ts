import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

/*
 * Definición necesaria de datos para usar en TypeORM CLI
 * para poder generar las migraciones.
 */

/*
 ! IMPORTANTE: Los imports anteriores usan lo que ya está instalado en el proyecto, (node_modules y .env) por lo que NO funcionarán si no se hace un `npm install` antes.

 ? 'reflect-metadata' permite interpretar de forma correcta los decoradores de los archivos entities para que puedan ser compilados desde TS a JS.
 ? 'dotenv/config' permite acceder a las variables de entorno disponibles.
 */

const dbVariables = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

/*
 ! IMPORTANTE: process.cwd() siempre apunta al directorio desde donde corres el comando.
 */

const rootDir = process.cwd();

/*
 * Entities se registran en cada módulo.
 * Migrations solo se encuentran en directorio migrations.
 */

/*
 * El CLI se ejecuta desde directorio backend.
 * usando el siguiente comando:
 *
 * npx typeorm-ts-node-commonjs migration:generate -pd dist-migrations/database/data-source.js src/migrations/createCategoriesTable
 */

export default new DataSource({
  type: 'postgres',
  synchronize: false,
  entities: [`${rootDir}/**/entities/*.js`],
  migrations: [`${rootDir}/**/migrations/*.ts`],
  host: dbVariables.host,
  port: Number(dbVariables.port),
  username: dbVariables.username,
  password: dbVariables.password,
  database: dbVariables.database,
});
