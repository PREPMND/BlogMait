import { string ,} from "@preplabs/validator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";

const LoginSchema=({
    email:string().min(5).max(30).contains("@").contains("."),
    password:string().min(8).max(30),
})


export default function LoginForm(){
    const [loading ,setIsLoading]=useState(false);

    const form=useForm
    return (
        <div>
            
        </div>
    )
}