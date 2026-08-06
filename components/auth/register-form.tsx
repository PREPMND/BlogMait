import { useForm } from "react-hook-form";
import { search, string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

const RegisterSchema = {
    username: string().min(4).max(20),
    email: string().min(5).max(30).contains("@").contains("."),
    password: string().min(8).max(30),
    confirmPassword: search(),
};

type RegisterFormValues = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
};

export default function RegisterForm() {
    const [errorRegister, seterrorRegister] = useState(false);
    const [errorMessage, setErorrMesssage] = useState<string | undefined>("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); 

    const form = useForm<RegisterFormValues>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        // reset message alerts on every click
        seterrorRegister(false);
        setErorrMesssage("");
        setSuccess(false);

        // client-Side Input Valdation Checks
        const usernameCheck = RegisterSchema.username.safeCheck(data.username);
        const emailCheck = RegisterSchema.email.safeCheck(data.email);
        const passwordCheck = RegisterSchema.password.safeCheck(data.password);

        if (!usernameCheck.ok) {
            seterrorRegister(true);
            setErorrMesssage(usernameCheck.error);
            return;
        }

        if (!emailCheck.ok) {
            seterrorRegister(true);
            setErorrMesssage(emailCheck.error);
            return;
        }

        if (!passwordCheck.ok) {
            seterrorRegister(true);
            setErorrMesssage(passwordCheck.error);
            return;
        }

        if (data.password !== data.confirmPassword) {
            seterrorRegister(true);
            setErorrMesssage("Passwords are not matching");
            return;
        }

        try {
            setLoading(true);
            const { error } = await signUp.email({
                name: data.username,
                email: data.email,
                password: data.password
            });

            if (error) {
                seterrorRegister(true);
                setErorrMesssage(error.message || "An authentication error occurred.");
                return;
            }

            console.log("Valid Data:", data);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 2500);

        } catch (err) {
            console.log(err);
            
            seterrorRegister(true);
            setErorrMesssage("Network error. Could not reach server.");
        } finally {
            setLoading(false);
            route.pusg
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 *:text-[18px] flex flex-col justify-center items-center">
            <div className="space-y-1 w-full md:max-w-[70%]">
                <Label htmlFor="username"><span>   </span>Username</Label>
                <Input
                    className="min-h-[38px] "
                    id="username"
                    type="text"
                    placeholder="Enter your username"
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
                <Label htmlFor="confirm-password"><span>   </span>Confirm Password</Label>
                <Input
                    className="min-h-[38px] "
                    id="confirm-password"
                    type="password" 
                    placeholder="Confirm your password"
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
                        <span className="flex gap-2">Registration <span className="hidden md:flex">successful!</span></span>
                    </div>
                )}
            </div>
            <Button
                disabled={loading} 
                className={`w-[110px] mx-auto py-4 border-b-4 border-r-3 hover:scale-[1.03] transition-all duration-500 ease-in-out hover:border-b-sky-100 hover:border-r-indigo-200`}
                type="submit"
            >
                {loading ? "Saving..." : "Register"}
            </Button>
        </form>
    );
}
