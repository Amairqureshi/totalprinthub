import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = 'nodejs';

// Init Clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const orderId = params.id;

        const { data: order, error } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (*)
            `)
            .eq("id", orderId)
            .single();

        if (error) {
            console.error("Fetch order error:", error);
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Internal fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const orderId = params.id;
        const { status } = await request.json();

        // 1. Update Database
        const { data: order, error } = await supabase
            .from("orders")
            .update({ status: status })
            .eq("id", orderId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 2. Send Email Notification
        if (resend && order) {
            let subject = "";
            let message = "";

            switch (status) {
                case "processing":
                    subject = `We are working on your order #${orderId.slice(0, 8)}`;
                    message = "Great news! We have started processing your order. We will let you know when it ships.";
                    break;
                case "shipped":
                    subject = `Your order #${orderId.slice(0, 8)} is on the way!`;
                    message = "Your items have been shipped and are making their way to you.";
                    break;
                case "delivered":
                    subject = `Order #${orderId.slice(0, 8)} Delivered`;
                    message = "Your order has been marked as delivered. Enjoy your custom prints!";
                    break;
                case "cancelled":
                    subject = `Order #${orderId.slice(0, 8)} Cancelled`;
                    message = "Your order has been cancelled. If this was a mistake, please contact us.";
                    break;
            }

            if (subject) {
                try {
                    await resend.emails.send({
                        from: "TotalPrintHub <onboarding@resend.dev>", // Testing domain
                        to: order.email,
                        subject: subject,
                        html: `
                            <h1>Order Update</h1>
                            <p>Hi ${order.full_name},</p>
                            <p>${message}</p>
                            <br/>
                            <p><strong>Current Status:</strong> <span style="text-transform: capitalize;">${status}</span></p>
                            <br/>
                            <p>Thank you for choosing TotalPrintHub.</p>
                        `
                    });
                    console.log(`Email sent for status: ${status}`);
                } catch (emailErr) {
                    console.error("Failed to send status email:", emailErr);
                }
            }
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
