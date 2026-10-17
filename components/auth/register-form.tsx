import { useForm } from "react-hook-form";
import { search, string } from "@preplabs/validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { useLoadingBar } from "@/components/ui/loading-bar";

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
    image?: string;
};

export default function RegisterForm() {
    const [errorRegister, seterrorRegister] = useState(false);
    const [errorMessage, setErorrMesssage] = useState<string | undefined>("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const router = useRouter()
    const loadingBar = useLoadingBar()
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
            const barId = loadingBar.start("Creating your account...")
            const { error } = await signUp.email({
                name: data.username,
                email: data.email,
                password: data.password,
                image: profilePicture,
            });

            if (error) {
                seterrorRegister(true);
                setErorrMesssage(error.message || "An authentication error occurred.");
                loadingBar.error(barId, "Registration failed")
                return;
            }

            loadingBar.success(barId, "Account created")
            setSuccess(true);

            const emailBarId = loadingBar.start("Sending welcome email...")
            try {
                const res = await fetch("/api/email/welcome", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: data.email, name: data.username }),
                })
                if (res.ok) {
                    loadingBar.success(emailBarId, "Welcome email sent")
                } else {
                    loadingBar.error(emailBarId, "Email could not be sent")
                }
            } catch (e) {
                loadingBar.error(emailBarId, "Email could not be sent")
            }

            router.push('/');
            router.refresh();
        } catch (err) {
            console.log(err);

            seterrorRegister(true);
            setErorrMesssage("Network error. Could not reach server.");
        } finally {
            setLoading(false);

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
            <div>
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                    onUpload={() => {
                        setUploading(true);
                        setUploadError("");
                    }}
                    onSuccess={(result: any) => {
                        setProfilePicture(result.info.secure_url);
                        setUploading(false);
                    }}
                    onError={() => {
                        setUploadError("Failed to upload image.");
                        setUploading(false);
                    }}
                >
                    {({ open }) => (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => open()}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload Profile Picture"}
                        </Button>
                    )}

                </CldUploadWidget>
                {profilePicture && (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border"
                    />
                )}
                {uploadError && (
                    <p className="text-sm text-red-500">
                        {uploadError}
                    </p>
                )}

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
                disabled={loading || uploading}
                className={`w-[110px] mx-auto py-4 border-b-4 border-r-3 hover:scale-[1.03] transition-all duration-500 ease-in-out hover:border-b-sky-100 hover:border-r-indigo-200`}
                type="submit"
            >
                {loading ? "Saving..." : "Register"}
            </Button>
        </form>
    );
}
