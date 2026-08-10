import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();
console.log("DB URL:", process.env.DATABASE_URL);

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT 1').then(() => console.log('success')).catch(console.error);
