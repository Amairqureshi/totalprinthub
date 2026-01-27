import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();

        // Initialize Supabase Client (modern SSR pattern)
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        // 1. Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("Auth error:", authError);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch orders for this user
        const { data: orders, error: dbError } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (*)
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
        }

        console.log(`[Orders API] User: ${user.id} (${user.email}). Found ${orders?.length || 0} orders.`);
        return NextResponse.json(orders);

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
