import { supabase, type UserProfile } from "./client";

/**
 * Sign Up with Email and Password
 */
export async function signUpWithEmail(email: string, password: string, fullName: string, phone: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;

        // Create profile immediately if user is created
        if (data.user) {
            await upsertUserProfile({
                id: data.user.id,
                email: email,
                full_name: fullName,
                phone: phone,
                last_login: new Date().toISOString(),
            });
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error signing up:", error);
        return { success: false, error };
    }
}

/**
 * Sign In with Email and Password
 */
export async function signInWithPassword(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error signing in:", error);
        return { success: false, error };
    }
}

/**
 * Send Magic Link to email (Deprecated/Backup)
 */
export async function sendEmailMagicLink(email: string) {
    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error sending magic link:", error);
        return { success: false, error };
    }
}

/**
 * Verify OTP and sign in
 */
export async function verifyOTP(phone: string, token: string) {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: "sms",
        });

        if (error) throw error;

        // Create or update user profile
        if (data.user) {
            await upsertUserProfile({
                id: data.user.id,
                email: data.user.email || "",
                last_login: new Date().toISOString(),
            });
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, error };
    }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error signing in with Google:", error);
        return { success: false, error };
    }
}

/**
 * Sign out
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error);
        return { success: false, error };
    }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) throw error;
        return { success: true, user };
    } catch (error) {
        console.error("Error getting current user:", error);
        return { success: false, error };
    }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase
            .from("users_profile")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error: any) {
        // Ignore AbortError and empty errors caused by navigation cancalleation
        if (error.name !== "AbortError" && Object.keys(error).length > 0) {
            console.error("Error getting user profile:", error);
        }
        return null;
    }
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(profile: Partial<UserProfile>) {
    try {
        const { data, error } = await supabase
            .from("users_profile")
            .upsert(
                {
                    ...profile,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: "id",
                }
            )
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error upserting user profile:", error);
        return { success: false, error };
    }
}

/**
 * Sync user with MedusaJS backend
 */
export async function syncWithMedusa(userId: string, phone: string, email?: string) {
    try {
        const response = await fetch("/api/auth/sync-medusa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, phone, email }),
        });

        if (!response.ok) throw new Error("Failed to sync with Medusa");

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error syncing with Medusa:", error);
        return { success: false, error };
    }
}

/**
 * Send password reset email
 */
export async function resetPasswordForEmail(email: string) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, error };
    }
}

/**
 * Update password (for logged in user)
 */
export async function updatePassword(password: string) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false, error };
    }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
    try {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error resending verification email:", error);
        return { success: false, error };
    }
}
