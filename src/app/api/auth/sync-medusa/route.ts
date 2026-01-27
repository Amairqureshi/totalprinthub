import { NextRequest, NextResponse } from "next/server";

/**
 * API route to sync Supabase user with MedusaJS backend
 * This creates or updates a customer in Medusa when a user signs in
 */
export async function POST(request: NextRequest) {
    try {
        const { userId, phone, email } = await request.json();

        if (!userId || !phone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // TODO: Implement MedusaJS customer creation/update
        // This will be implemented when MedusaJS backend is set up

        const medusaBackendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

        if (!medusaBackendUrl) {
            console.warn("MedusaJS backend URL not configured");
            return NextResponse.json({ success: true, message: "Medusa sync skipped (not configured)" });
        }

        // Example implementation (uncomment when Medusa is ready):
        /*
        const response = await fetch(`${medusaBackendUrl}/store/customers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email || `${phone}@placeholder.com`,
            phone,
            metadata: {
              supabase_id: userId,
            },
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to create Medusa customer");
        }
    
        const data = await response.json();
        
        // Update Supabase profile with Medusa customer ID
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    
        await supabase
          .from("users_profile")
          .update({ medusa_customer_id: data.customer.id })
          .eq("id", userId);
        */

        return NextResponse.json({
            success: true,
            message: "User synced successfully (placeholder)",
        });
    } catch (error) {
        console.error("Error syncing with Medusa:", error);
        return NextResponse.json(
            { error: "Failed to sync with Medusa" },
            { status: 500 }
        );
    }
}
