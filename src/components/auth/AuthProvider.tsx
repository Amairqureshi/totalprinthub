"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase, type UserProfile } from "@/lib/supabase/client";
import { getCurrentUser, getUserProfile, upsertUserProfile } from "@/lib/supabase/auth";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const initAuth = async () => {
            try {
                // OPTIMIZATION: Use getSession() for instant local check instead of getUser()
                // Safely destructure data
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Error getting session:", error);
                }

                // Handle missing data object just in case
                const session = data?.session;
                const user = session?.user ?? null;

                setUser(user);

                // If user exists, fetch profile in background
                if (user) {
                    try {
                        let userProfile = await getUserProfile(user.id);
                        if (!userProfile) {
                            // Create profile if it doesn't exist
                            const { data } = await upsertUserProfile({
                                id: user.id,
                                email: user.email || "",
                                phone: user.phone || "",
                                last_login: new Date().toISOString(),
                            });
                            // If upsert returns data, use it; otherwise allow null
                            userProfile = data || null;
                        }
                        // Only update profile if we are still authenticated as this user
                        setProfile(userProfile);
                    } catch (err) {
                        console.error("Background profile fetch failed", err);
                    }
                }
            } catch (err: any) {
                // Ignore AbortError which happens on hot reload/navigation
                if (err.name !== "AbortError") {
                    console.error("Auth initialization crashed:", err);
                }
            } finally {
                // ALWAYS set loading to false, no matter what
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user || null);

            if (session?.user) {
                let userProfile = await getUserProfile(session.user.id);
                if (!userProfile) {
                    // Create profile on first login
                    const { data } = await upsertUserProfile({
                        id: session.user.id,
                        email: session.user.email || "",
                        phone: session.user.phone || "",
                        last_login: new Date().toISOString(),
                    });
                    userProfile = data || null;
                }
                setProfile(userProfile);
            } else {
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setUser(null);
            setProfile(null);
            router.refresh();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signOut: handleSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
