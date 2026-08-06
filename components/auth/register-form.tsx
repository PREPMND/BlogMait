import { useForm } from "react-hook-form";
import { search, string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
const RegisterSchema = {
    username:string().min(4).max(20),
    email: string().min(5).max(30).contains("@").contains("."),
    password: string().min(8).max(30),
    confirmPassword : search(),
};

type RegisterFormValues = {
    email: string;
    password: string;
    confirmPassword:string;
    username:string;
};

export default function RegisterForm() {
    const [errorRegister, seterrorRegister] = useState(false);
    const [errorMessage, setErorrMesssage] = useState<string | undefined>("");
    const [success, setSuccess] = useState(false);

    const form = useForm<RegisterFormValues>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword:"",
            username:"",
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        const username =RegisterSchema.username.safeCheck(data.username);
        const email = RegisterSchema.email.safeCheck(data.email);
        const password = RegisterSchema.password.safeCheck(data.password);
        const confirmPassword =RegisterSchema.confirmPassword.exact(data.password);
        console.log(confirmPassword);
        if (!email.ok) {
            console.log(email.error);
            seterrorRegister(true);
            setErorrMesssage(email.error);
            setSuccess(false);
            return;
        }

        if (!password.ok) {
            console.log(password.error);
            seterrorRegister(true);
            setErorrMesssage(password.error);
            setSuccess(false);
            return;
        }
        
        if(data.password!==data.confirmPassword){
            seterrorRegister(true);
            setErorrMesssage("Passwords are not matching");
            setSuccess(false);
        }

        console.log("Valid Data:", data);
        setSuccess(true);

        setTimeout(() => {
            setSuccess(false);
        }, 2500);
        seterrorRegister(false);
        setErorrMesssage("");
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 *:text-[18px] flex flex-col justify-center items-center">
            <div className="space-y-1 w-full md:max-w-[70%]">
                <Label htmlFor="email"><span>   </span>Username</Label>
                <Input
                    className="min-h-[38px] "
                    id="username"
                    type="text"
                    placeholder="Enter your email"
                    {...form.register("username")}
                />
            </div>
            <div className="space-y-2 w-full md:max-w-[70%]">
                <Label htmlFor="email"><span>   </span>Email</Label>
                <Input
                    className="min-h-[38px] "
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register("email")}
                />
            </div>

            <div className="space-y-2 w-full md:max-w-[70%] ">
                <Label htmlFor="password"><span>   </span>Password</Label>
                <Input
                    className="min-h-[38px]"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                />
            </div>
            <div className="space-y-2 w-full md:max-w-[70%]">
                <Label htmlFor="email"><span>   </span>Confirm Password</Label>
                <Input
                    className="min-h-[38px] "
                    id="confirm-password"
                    type="text"
                    placeholder="Enter your email"
                    {...form.register("confirmPassword")}
                />
            </div>
            <div>{errorRegister && (
                <div className="text-red-400 text-[14px]">
                    {errorMessage}
                </div>)}
            </div>
            <div>
                {success && (
                    <div className="flex items-center gap-1 w-[250px] rounded-md bg-green-100 px-[10px] py-2 mx-auto justify-center text-green-700">
                        <span>✅</span>
                        <span className="flex gap-2">Registeration <span className="hidden md:flex">successful!</span></span>
                    </div>
                )}
            </div>
            <Button className={`w-[110px] mx-auto py-4 border-b-4 border-r-3 hover:scale-[1.04] transition-transform duration-500 ease-in-out border-b-sky-100 border-l-sky-100`} type="submit">
                Register
            </Button>
        </form>
    );
}