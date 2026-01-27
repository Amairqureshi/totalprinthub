"use server";

import { Resend } from "resend";

// Initialize Resend with API Key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "onboarding@resend.dev"; // Fallback for dev
const FROM_EMAIL = "TotalPrintHub <onboarding@resend.dev>"; // Use verified domain in prod

interface QuoteRequestData {
    id: string;
    product_name: string;
    contact_name: string;
    contact_email: string;
    quantity: string;
    description: string;
    file_url?: string;
    type: string;
}

export async function sendQuoteRequestEmail(data: QuoteRequestData) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Email skipped.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Quote Request: ${data.product_name}`,
            html: `
                <h2>New Custom Quote Request</h2>
                <p><strong>Customer:</strong> ${data.contact_name} (${data.contact_email})</p>
                <p><strong>Product:</strong> ${data.product_name} (${data.type})</p>
                <p><strong>Quantity:</strong> ${data.quantity}</p>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong>Description/Requirements:</strong><br/>
                    ${data.description}
                </div>

                ${data.file_url ? `<p><strong>Attachment:</strong> <a href="${data.file_url}">View File</a></p>` : ''}
                
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes">View in Admin Panel</a></p>
            `
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to send quote request email:", error);
        return { success: false, error };
    }
}

export async function sendQuoteReplyEmail(data: QuoteRequestData, replyMessage: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Email skipped.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: data.contact_email,
            subject: `Update on your Quote for ${data.product_name}`,
            html: `
                <h2>Quote Response Received</h2>
                <p>Hi ${data.contact_name},</p>
                <p>We have reviewed your quote request for <strong>${data.product_name}</strong>.</p>
                
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin: 15px 0;">
                    <strong>Admin Response / Pricing:</strong><br/>
                    <p style="white-space: pre-wrap;">${replyMessage}</p>
                </div>

                <p>Please log in to your dashboard to proceed or reply specific details.</p>
                
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/account/quotes">View My Quotes</a></p>
                
                <hr/>
                <p style="font-size: 12px; color: #666;">TotalPrintHub Support</p>
            `
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to send quote reply email:", error);
        return { success: false, error };
    }
}
