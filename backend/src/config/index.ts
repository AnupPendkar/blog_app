import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'postgres';
import * as userSchema from '../schema/userSchema';
import * as postSchema from '../schema/postSchema';
import { Pool } from 'pg';

export const psConnection = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
});

export const db = drizzle(psConnection, { schema: { ...userSchema, ...postSchema } });

// export const psConnection = postgres({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   database: process.env.DATABASE_NAME,
//   password: process.env.DATABASE_PASSWORD,
// });
