import { betterAuth } from "better-auth";

export const auth=betterAuth({
    appName:"Blog Next",
    secret:process.env.BETTER_AUTH_SECRET || '',
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:false,
        autoSignIn:true,
        minPasswordLength:8,
        maxPasswordLength:30,
    },
    session:{
        expiresIn:60*60*24*7,
        updateAge:60*60*24,
        cookieCache:{
            enabled:true,
            maxAge:60*60*2
        },
        disableSessionRefresh:true
    },
    advanced:
    {
        
    }
    ,
    baseURL:process.env.BASE_URL
})