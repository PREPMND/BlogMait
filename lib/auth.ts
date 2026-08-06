import { betterAuth } from "better-auth";
import {} from "auth"
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
        useSecureCookies:process.env.NODE_ENV==='production',
        defaultCookieAttributes:{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production'
        }
    }
    ,
    baseURL:process.env.BASE_URL
})