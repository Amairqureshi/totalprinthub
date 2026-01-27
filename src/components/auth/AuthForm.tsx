"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, signUpWithEmail, signInWithGoogle } from "@/lib/supabase/auth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema for Login
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Schema for Sign Up
const signupSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
    initialMode?: "login" | "signup";
    initialEmail?: string;
    onSuccess?: () => void;
}

export function AuthForm({ initialMode = "login", initialEmail, onSuccess }: AuthFormProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    // Forgot Password Form (Simple local state)
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    // Login Form
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: initialEmail || "",
        }
    });

    // Signup Form
    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: initialEmail || "",
        }
    });

    const onLogin = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await signInWithPassword(data.email, data.password);
            if (res.success) {
                toast.success("Successfully logged in!");
                onSuccess?.();
            } else {
                const msg = (res.error as any)?.message || "Login failed";
                setLastError(msg);
                if (msg.includes("Invalid login credentials")) {
                    toast.error("Invalid credentials", {
                        description: "Check your password or verify your email.",
                        duration: 10000,
                        action: process.env.NODE_ENV === "development" ? {
                            label: "Force Verify (Dev)",
                            onClick: async () => {
                                try {
                                    const res = await fetch(`/api/admin/verify-email?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
                                    const json = await res.json();
                                    if (json.success) {
                                        toast.success("Account verified! Try logging in now.");
                                    } else {
                                        toast.error(json.error || "Verification failed");
                                    }
                                } catch (err) {
                                    toast.error("Failed to call verify endpoint");
                                }
                            }
                        } : {
                            label: "Resend Email",
                            onClick: async () => {
                                const { resendVerificationEmail } = await import("@/lib/supabase/auth");
                                const res = await resendVerificationEmail(data.email);
                                if (res.success) {
                                    toast.success("Verification email sent!");
                                } else {
                                    toast.error("Failed to resend email");
                                }
                            }
                        }
                    });
                } else {
                    setLastError(msg);
                    toast.error(msg);
                }
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                toast.error("Connection interrupted. Please try again.");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const onSignup = async (data: SignupFormData) => {
        setLoading(true);
        try {
            const res = await signUpWithEmail(data.email, data.password, data.fullName, data.phone);
            if (res.success) {
                toast.success("Account created! Please check your email to verify.");
                // Optionally switch to login or show verification message
                setMode("login");
            } else {
                toast.error((res.error as any)?.message || "Sign up failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            if (!result.success) {
                toast.error("Failed to sign in with Google");
            }
        } finally {
            setLoading(false);
        }
    };

    const onForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        try {
            const { resetPasswordForEmail } = await import("@/lib/supabase/auth");
            const res = await resetPasswordForEmail(resetEmail);
            if (res.success) {
                toast.success("Password reset link sent! Check your email.");
                setShowForgotPassword(false);
            } else {
                toast.error((res.error as any)?.message || "Failed to send reset email");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setResetLoading(false);
        }
    };

    if (showForgotPassword) {
        return (
            <div className="w-full max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h1>
                    <p className="text-sm text-slate-500">Enter your email to receive a password reset link</p>
                </div>

                <form onSubmit={onForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-9"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={resetLoading}>
                        {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        Back to Login
                    </Button>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {mode === "login" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm text-slate-500">
                    {mode === "login"
                        ? "Enter your credentials to access your account"
                        : "Enter your details to create your account"}
                </p>
            </div>

            <Tabs value={mode} onValueChange={(v: string) => setMode(v as "login" | "signup")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-9"
                                    {...loginForm.register("email")}
                                />
                            </div>
                            {loginForm.formState.errors.email && (
                                <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-xs text-blue-600 hover:text-blue-500 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-9 pr-9"
                                    {...loginForm.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {loginForm.formState.errors.password && (
                                <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>

                        {/* Dev Helper for Stuck Customes */}
                        {lastError && lastError.includes("Invalid login credentials") && (
                            <div className="p-3 mt-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-xs text-yellow-800 mb-2">
                                    <strong>Dev Help:</strong> Account might be stuck/unverified.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full text-xs h-8 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                                    onClick={async () => {
                                        const email = loginForm.getValues("email");
                                        const password = loginForm.getValues("password");
                                        if (!email || !password) return toast.error("Enter email & password first");

                                        toast.loading("Verifying...");
                                        try {
                                            const res = await fetch(`/api/admin/verify-email?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
                                            const json = await res.json();
                                            if (json.success) {
                                                toast.dismiss();
                                                toast.success("Fixed! You can Login now.");
                                            } else {
                                                toast.dismiss();
                                                toast.error(json.error || "Failed");
                                            }
                                        } catch (e: any) {
                                            if (e.name === "AbortError") {
                                                toast.error("Request timed out. Please try again.");
                                            } else {
                                                toast.error("Error calling admin API");
                                            }
                                        }
                                    }}
                                >
                                    Force Verify & Fix Account
                                </Button>
                            </div>
                        )}
                    </form>
                </TabsContent>

                <TabsContent value="signup">
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    className="pl-9"
                                    {...signupForm.register("fullName")}
                                />
                            </div>
                            {signupForm.formState.errors.fullName && (
                                <p className="text-xs text-red-500">{signupForm.formState.errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-9"
                                    {...signupForm.register("email")}
                                />
                            </div>
                            {signupForm.formState.errors.email && (
                                <p className="text-xs text-red-500">{signupForm.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="phone"
                                    placeholder="1234567890"
                                    className="pl-9"
                                    {...signupForm.register("phone")}
                                />
                            </div>
                            {signupForm.formState.errors.phone && (
                                <p className="text-xs text-red-500">{signupForm.formState.errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-9 pr-9"
                                    {...signupForm.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {signupForm.formState.errors.password && (
                                <p className="text-xs text-red-500">{signupForm.formState.errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-50 px-2 text-slate-500">Or continue with</span>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Google
            </Button>
        </div>
    );
}
