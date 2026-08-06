import { betterAuth } from "better-auth";

export default auth=betterAuth({
    emailAndPassword:{
        enabled:true,
    }
})