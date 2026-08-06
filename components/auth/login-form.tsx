import { useForm } from "react-hook-form";
import { string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "@/lib/auth-client"; // Imported Better-Auth sign-in helper
import { useRouter } from "next/navigation"; // Correct hook for Next.js App Router

const LoginSchema = {
    email: string().min(5).max(30).contains("@").contains("."),
    password: string().min(8).max(30),
};

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const [errorLogin, seterrorLogin] = useState(false);
    const [errorMessage, setErorrMesssage] = useState<string | undefined>("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state tracking variable
    const router = useRouter(); // App Router instantiation

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        // Reset state triggers on fresh execution loop
        seterrorLogin(false);
        setErorrMesssage("");
        setSuccess(false);

        // 1. Client-Side Parsing Gating Checks
        const emailCheck = LoginSchema.email.safeCheck(data.email);
        const passwordCheck = LoginSchema.password.safeCheck(data.password);

        if (!emailCheck.ok) {
            console.log(emailCheck.error);
            seterrorLogin(true);
            setErorrMesssage(emailCheck.error);
            return;
        }

        if (!passwordCheck.ok) {
            console.log(passwordCheck.error);
            seterrorLogin(true);
            setErorrMesssage(passwordCheck.error);
            return;
        }

        // 2. Authenticate Session via Better-Auth Server API Pipeline
        try {
            setLoading(true);
            const { error } = await signIn.email({
                email: data.email,
                password: data.password,
            });

            if (error) {
                seterrorLogin(true);
                setErorrMesssage(error.message || "Invalid credentials provided.");
                return;
            }

            console.log("Valid Data:", data);
            setSuccess(true);

            router.push('/');
            router.refresh();

        } catch (err) {
            console.log(err);
            seterrorLogin(true);
            setErorrMesssage("Network error. Could not connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 *:text-[18px] flex flex-col justify-center items-center">
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
            <div>{errorLogin && (
                <div className="text-red-400 text-[14px]">
                    {errorMessage}
                </div>)}
            </div>
            <div>
                {success && (
                    <div className="flex items-center gap-1 w-[250px] rounded-md bg-green-100 px-[10px] py-2 mx-auto justify-center text-green-700">
                        <span>✅</span>
                        <span className="flex gap-2">Login <span className="hidden md:flex">successful!</span></span>
                    </div>
                )}
            </div>
            <Button
                disabled={loading} // Freezes execution loop buttons during pending database traffic
                className={`w-[110px] mx-auto py-4 border-b-4 border-r-3 hover:scale-[1.03] transition-all duration-500 ease-in-out hover:border-b-sky-100 hover:border-r-indigo-200`}
                type="submit"
            >
                {loading ? "Verifying..." : "Login"}
            </Button>
        </form>
    );
}
