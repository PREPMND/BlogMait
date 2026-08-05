import { useForm } from "react-hook-form";
import { string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
const LoginSchema = {
    email: string().min(5).max(30).contains("@").contains("."),
    password: string().min(8).max(30),
};

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const [errorLogin,seterrorLogin]=useState(false);

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        const email = LoginSchema.email.check(data.email);
        const password = LoginSchema.password.check(data.password);

        if (!email.ok) {
            console.log(email.error);
            seterrorLogin(true);
            return;
        }

        if (!password.ok) {
            console.log(password.error);
            seterrorLogin(true);
            return;
        }

        console.log("Valid Data:", data);
        seterrorLogin(false);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register("email")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                />
            </div>
            <div>{errorLogin && (
                <div>

            </div>)}</div>
            <Button type="submit">
                Login
            </Button>
        </form>
    );
}