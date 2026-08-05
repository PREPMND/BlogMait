import { string ,} from "@preplabs/validator";
import {z} from "zod";

const LoginSchema=({
    email:string().min(5).max(30).contains("@").contains("."),
    password:string().min(8).max(30),
})

type LoginFormValues=z.infer<typeof LoginSchema>

export default function LoginForm(){
    return (
        <div>
            
        </div>
    )
}