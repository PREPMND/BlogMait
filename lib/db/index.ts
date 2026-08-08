import {drizzle} from "drizzle-orm/node-postgres"
import { Pool} from "pg"
import * as schema from "./schema"

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:
    process.env.NODE_ENV==='production'?{
        rejectUnauthorized:false,
    }:false,
    max:10
});
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(
  "DATABASE_URL exists:",
  !!process.env.DATABASE_URL
);
console.log(
  "DATABASE_URL starts with:",
  process.env.DATABASE_URL?.split("@")[1]
);

export const db =drizzle(pool,{schema});

export async function getClient(){
    const client=await pool.connect();
    return client;
}