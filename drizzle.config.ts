import {Config} from "drizzle-kit";

export default ({
    dialect:"postgresql",
    schema:'./lib/db/schema',
    out:"./drizzle",
    dbCredentials:{
        url:process.env.DATABASE_URL || '',
        
    },
    verbose:true,
    strict:true
}) as Config