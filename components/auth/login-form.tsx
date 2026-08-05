import { useForm } from "react-hook-form";
import { string } from "@preplabs/validator";

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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input
        {...form.register("email")}
        placeholder="Email"
      />

      <input
        type="password"
        {...form.register("password")}
        placeholder="Password"
      />

      <button type="submit">Login</button>
    </form>
  );
}