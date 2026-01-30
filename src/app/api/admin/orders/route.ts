import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use Service Role Key to bypass RLS and fetch ALL orders
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fwkribibpjwkeyeomecd.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3a3JpYmlicGp3a2V5ZW9tZWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NjYwODcsImV4cCI6MjA4NDU0MjA4N30.uOXQBlSsmK6VrQud-V6NXImPOn4J6xgX9LOXLaDyjCE";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Admin fetch error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
