"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignupContent() {
    const searchParams = useSearchParams();
    const router = require("next/navigation").useRouter();
    const { supabase } = require("@/lib/supabase/client");
    const email = searchParams.get("email") || undefined;

    require("react").useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.replace("/");
            }
        };
        checkSession();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <AuthForm initialMode="signup" initialEmail={email} />

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupContent />
        </Suspense>
    );
}
