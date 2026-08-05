import { useForm } from "react-hook-form";
import { string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const LoginSchema = {
    email: string().min(5).max(30).contains("@").contains("."),
    password: string().min(8).max(30),
};

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginForm() {
    

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
            return;
        }

        if (!password.ok) {
            console.log(password.error);
            return;
        }

        console.log("Valid Data:", data);
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

            <Button type="submit">
                Login
            </Button>
        </form>
    );
}