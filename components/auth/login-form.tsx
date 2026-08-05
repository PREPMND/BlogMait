import { useForm } from "react-hook-form";
import { string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
        const email = LoginSchema.email.safeCheck(data.email);
        const password = LoginSchema.password.safeCheck(data.password);

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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">
                    Login
                </Button>
            </form>
        </Form>
    );
}