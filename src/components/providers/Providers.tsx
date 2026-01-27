"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>{children}</CartProvider>
        </AuthProvider>
    );
}
