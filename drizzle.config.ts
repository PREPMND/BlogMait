import {defineConfig} from "drizzle-kit";

export default defineConfig({
    dialect:"postgresql",
    schema:"./src/lib/db/schema.ts",
    out:"./drizzle",
    dbCredentials:{
        url:process.env.DATABASE_URL || '',
        requireEmailVerification:false,
        
    },
    verbose:true,
    strict:true
})