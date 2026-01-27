import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Correct Next.js 15+ param handling
) {
    try {
        const id = (await params).id; // Await params
        const cookieStore = await cookies();

        // Initialize Supabase Client (modern SSR pattern)
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignored in route handler
                        }
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch specific order ensuring it belongs to user
        const { data: order, error: dbError } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (*)
            `)
            .eq("id", id)
            .eq("user_id", user.id) // Security: MUST belong to user
            .single();

        if (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
