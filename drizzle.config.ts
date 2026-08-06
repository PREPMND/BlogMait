import {Config} from "drizzle-kit";

export default ({
    dialect:"postgresql",
    schema:'./src/',
    out:"./drizzle",
    dbCredentials:{
        url:process.env.DATABASE_URL || '',
        
    },
    verbose:true,
    strict:true
}) as Config