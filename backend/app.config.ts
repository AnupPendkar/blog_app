import type { Config } from 'drizzle-kit';

export const corsOptions = {
  origin: 'http://10.0.2.15:3200', // replace with your client's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable cookies and other credentials
};

export default {
  schema: './src/schema/*',
  out: './migrations',
  driver: 'pg', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
  },
} satisfies Config;
