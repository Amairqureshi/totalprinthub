import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        // 1. List users to find the one with this email
        // Note: listUsers defaults to page 1, limit 50. Should be enough for dev.
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) throw listError;

        const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.email_confirmed_at && !searchParams.get("password")) {
            return NextResponse.json({ message: "User is already verified!" });
        }

        // 2. Prepare updates
        const updates: any = {
            email_confirmed_at: new Date().toISOString(),
        };

        const password = searchParams.get("password");
        if (password) {
            updates.password = password;
        }

        // 3. Update the user
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            updates
        );

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            message: `Successfully verified email for ${email}${password ? " and updated password" : ""}`,
            user_id: user.id
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
