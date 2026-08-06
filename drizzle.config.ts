import {Config} from "drizzle-kit";

export default ({
    dialect:"postgresql",
    schema:'./lib/db/schema.ts',
    out:"./drizzle",
    dbCredentials:{
        url:'postgresql://postgresql:prep@localhost:5432/BlogNextts,'
    },
    verbose:true,
    strict:true
}) as Config