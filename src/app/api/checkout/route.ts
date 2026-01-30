import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CheckoutPayload } from "@/lib/types/database";

// Initialize Supabase Admin Client (needed for inserting into orders table if RLS is strict, or general backend ops)
// Note: For client-side triggered inserts where policies allow "Anyone", standard client works, 
// but inside an API route it's safer to use the service role key if available, or just standard anon key with proper policies.
// We will use the standard setup variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fwkribibpjwkeyeomecd.supabase.co";
// Use Service Role Key to bypass RLS (since this is a server-side admin operation)
// Fallback to Anon key (which might fail RLS) if Service Role is missing
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk2NjA4NywiZXhwIjoyMDg0NTQyMDg3fQ.z3L68gZOi8aaQtRN9VBfHxy_oJcI2Za5cA9INNxYXBk";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        const payload: CheckoutPayload = await request.json();
        const { shippingDetails, cartItems, totalAmount, userId } = payload;

        // 1. Validate Data (Basic)
        if (!shippingDetails || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        // 2. Insert Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: userId || null,
                email: shippingDetails.email,
                full_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                phone: shippingDetails.phone,
                address_line1: shippingDetails.address,
                city: shippingDetails.city,
                pincode: shippingDetails.pincode,
                total_amount: totalAmount,
                status: "pending"
            })
            .select()
            .single();

        if (orderError) {
            console.error("Order creation error:", orderError);
            return NextResponse.json({ error: `Failed to create order: ${orderError.message}` }, { status: 500 });
        }

        // 3. Insert Order Items
        const orderItemsData = cartItems.map((item) => ({
            order_id: order.id,
            product_name: item.productName,
            quantity: item.configuration.quantity,
            price: item.pricing.finalPrice,
            configuration: item.configuration,
            product_image: item.productImage
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItemsData);

        if (itemsError) {
            console.error("Order items creation error:", itemsError);
            // In a real app, you might want to rollback the order here
            return NextResponse.json({ error: `Failed to create order items: ${itemsError.message}` }, { status: 500 });
        }

        // 4. Send Email (Fire and Forget)
        if (resend) {
            try {
                await resend.emails.send({
                    from: "TotalPrintHub <onboarding@resend.dev>", // Use Resend's test domain
                    to: shippingDetails.email,
                    subject: `Order Confirmation #${order.id.slice(0, 8)}`,
                    html: `
                        <h1>Thank you for your order, ${shippingDetails.firstName}!</h1>
                        <p>We have received your order and it is currently being processed.</p>
                        
                        <h2>Order Summary</h2>
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                        
                        <h3>Items:</h3>
                        <ul>
                            ${cartItems.map(item => `
                                <li>
                                    <strong>${item.productName}</strong> - Qty: ${item.configuration.quantity}
                                </li>
                            `).join('')}
                        </ul>
                        
                        <p>We will notify you when your items are shipped.</p>
                    `
                });
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
                // Don't fail the request if email fails, just log it
            }
        } else {
            console.log("Resend API Key missing. Skipping email.");
            console.log("Would have sent email to:", shippingDetails.email);
        }

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
