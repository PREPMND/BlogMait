import { betterAuth } from "better-auth";

export const auth=betterAuth({
    appName:"Blog Next",
    secret:process.env.,
    emailAndPassword:{
        enabled:true,
    }
})