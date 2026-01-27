"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectedFrom") || "/";

    useEffect(() => {
        // Auto-redirect if already logged in
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.replace(redirectTo);
            }
        };
        checkSession();
    }, [router, redirectTo]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <AuthForm
                    initialMode="login"
                    onSuccess={() => router.push(redirectTo)}
                />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
}
