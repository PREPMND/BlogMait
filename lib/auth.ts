import { betterAuth } from "better-auth";

export const auth=betterAuth({
    appName:"Blog Next",
    secret:process.env.BETTER_AUTH_SECRET || '',
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:false,
        
    },
    baseURL:process.env.BASE_URL
})