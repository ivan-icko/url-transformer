import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mysql: {
    host: process.env.MYSQL_DB_HOST,
    port: Number(process.env.MYSQL_DB_PORT) || 3306,
    user: process.env.MYSQL_DB_USER,
    pass: process.env.MYSQL_DB_PASS,
    schema: process.env.MYSQL_DB_SCHEMA,
    dropSchema: process.env.MYSQL_DB_DROP_SCHEMA === 'true' || false,
    synchronize: process.env.MYSQL_DB_SYNCHRONIZE === 'true' || false,
    logging: process.env.MYSQL_DB_LOGGING === 'true' || false,
    connectTimeout: process.env.MYSQL_DB_CONNECT_TIMEOUT || 1000,
    acquireTimeout: process.env.MYSQL_DB_ACQUIRE_TIMEOUT || 500,
  },
}));
