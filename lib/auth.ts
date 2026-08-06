import { betterAuth } from "better-auth";

export const auth=betterAuth({
    appName:"Blog Next",
    
    emailAndPassword:{
        enabled:true,
    }
})