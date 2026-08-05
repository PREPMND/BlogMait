import { string ,} from "@preplabs/validator";
import {z} from "zod";

const LoginSchema=({
    email:string().min(5).max(30);
    password:string;
})
export default function LoginForm(){
    return (
        <div>
            
        </div>
    )
}