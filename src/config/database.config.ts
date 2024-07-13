import { registerAs } from '@nestjs/config';
import { DATABASE_CONFIG } from '../common/constants/general';

export default registerAs(DATABASE_CONFIG, () => ({
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
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    database: Number(process.env.REDIS_DATABASE) || 0,
    redisGlobalPrefix: process.env.REDIS_GLOBAL_PREFIX || 'nest:',
  },
  nodeCache: {
    ttl: Number(process.env.NODE_CACHE_TTL) || 100,
  },
}));
