import { Pool, neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

// Neon Serverless HTTP SQL driver for lightweight, high-performance querying
export const sql = connectionString ? neon(connectionString) : null;

// Neon Connection Pool for transaction-intensive or session-based queries
export const pool = connectionString ? new Pool({ connectionString }) : null;

export default { sql, pool };
