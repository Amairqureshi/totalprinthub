"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginModal from "@/components/auth/LoginModal";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";
import { isSupabaseReady } from "@/lib/supabase/client";

export default function AuthTestPage() {
    const { user, profile, loading } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const supabaseConfigured = isSupabaseReady();

    const handleSignOut = async () => {
        await signOut();
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

                {/* Supabase Configuration Status */}
                <div className={`rounded-lg p-6 mb-6 ${supabaseConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <h2 className="text-xl font-semibold mb-2">
                        {supabaseConfigured ? '✅ Supabase Configured' : '⚠️ Supabase Not Configured'}
                    </h2>
                    {!supabaseConfigured && (
                        <div className="text-sm text-gray-700">
                            <p className="mb-2">Please add your Supabase credentials to <code className="bg-white px-2 py-1 rounded">.env.local</code></p>
                            <p>See <code className="bg-white px-2 py-1 rounded">SUPABASE_SETUP.md</code> for instructions.</p>
                        </div>
                    )}
                </div>

                {/* Authentication Status */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>

                    {loading ? (
                        <p className="text-gray-600">Loading...</p>
                    ) : user ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-green-900 font-semibold mb-2">✅ Logged In</p>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">User ID:</span> {user.id}</p>
                                    <p><span className="font-medium">Email:</span> {user.email || 'N/A'}</p>
                                    <p><span className="font-medium">Phone:</span> {user.phone || 'N/A'}</p>
                                </div>
                            </div>

                            {profile && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-blue-900 font-semibold mb-2">User Profile</p>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-medium">Full Name:</span> {profile.full_name || 'Not set'}</p>
                                        <p><span className="font-medium">Phone:</span> {profile.phone}</p>
                                        <p><span className="font-medium">Email:</span> {profile.email || 'Not set'}</p>
                                        <p><span className="font-medium">Medusa ID:</span> {profile.medusa_customer_id || 'Not synced'}</p>
                                        <p><span className="font-medium">Last Login:</span> {new Date(profile.last_login).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={async () => {
                                    const { upsertUserProfile } = await import("@/lib/supabase/auth");
                                    await upsertUserProfile({
                                        id: user.id,
                                        email: user.email || "",
                                        last_login: new Date().toISOString()
                                    });
                                    window.location.reload();
                                }} variant="secondary" className="flex-1">
                                    Manual Sync Profile
                                </Button>
                                <Button onClick={handleSignOut} variant="outline" className="flex-1">
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600">Not logged in</p>
                            <Button
                                onClick={() => setShowLogin(true)}
                                className="w-full"
                                disabled={!supabaseConfigured}
                            >
                                {supabaseConfigured ? 'Test Login' : 'Configure Supabase First'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Add Supabase credentials to <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code></li>
                        <li>Restart the dev server (Ctrl+C, then <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>)</li>
                        <li>Run the SQL schema in Supabase (see <code className="bg-gray-100 px-2 py-1 rounded">supabase-schema.sql</code>)</li>
                        <li>Refresh this page</li>
                        <li>Click "Test Login" button</li>
                        <li>Try logging in with your Email (Magic Link) or Google</li>
                        <li>Check that your user appears in Supabase dashboard</li>
                    </ol>
                </div>

                {/* Debug Info */}
                <details className="mt-6 bg-gray-100 rounded-lg p-4">
                    <summary className="cursor-pointer font-semibold">Debug Info</summary>
                    <pre className="mt-2 text-xs overflow-auto">
                        {JSON.stringify({
                            supabaseConfigured,
                            user: user ? { id: user.id, email: user.email, phone: user.phone } : null,
                            profile,
                            loading
                        }, null, 2)}
                    </pre>
                </details>
            </div>

            {/* Login Modal */}
            <LoginModal
                open={showLogin}
                onOpenChange={setShowLogin}
            />
        </div>
    );
}
