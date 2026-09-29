import { neon } from 'https://esm.sh/@neondatabase/serverless';

// Conexión oficial provista para el curso
const DATABASE_URL = 'postgresql://neondb_owner:npg_RrXCLte0VA4Q@ep-red-tooth-b576izzc.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const sql = neon(DATABASE_URL);