import {Config} from "drizzle-kit";

export default ({
    dialect:"postgresql",
    schema:'./lib/db/schema.ts',
    out:"./drizzle",
    dbCredentials:{
        url:'postgresql://neondb_owner:npg_UvLOcw2H7qnV@ep-restless-sunset-axgwu40g.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require'
    },
    verbose:true,
    strict:true
}) as Config