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
        expiresIn:60*60*
    }
    baseURL:process.env.BASE_URL
})