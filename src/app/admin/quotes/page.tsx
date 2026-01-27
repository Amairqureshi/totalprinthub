"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Quote {
    id: string;
    product_name: string;
    contact_name: string;
    contact_email: string;
    description: string;
    quantity: string;
    material?: string;
    size?: string;
    finish?: string;
    file_url?: string;
    status: string;
    created_at: string;
    admin_response?: string;
    type: string;
}

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
    const [responseText, setResponseText] = useState("");
    const [responseLoading, setResponseLoading] = useState(false);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("quotes")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) setQuotes(data);
        } catch (error) {
            console.error("Failed to fetch quotes", error);
            toast.error("Failed to load quotes");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (info: { status: string, response?: string }) => {
        if (!selectedQuote) return;

        try {
            setResponseLoading(true);
            const { error } = await supabase
                .from("quotes")
                .update({
                    status: info.status,
                    admin_response: info.response
                })
                .eq("id", selectedQuote.id);

            if (error) throw error;

            // Send Email Notification if responding
            if (info.status === 'responded' && info.response) {
                const { sendQuoteReplyEmail } = await import("@/app/actions/quote-actions");
                const emailResult = await sendQuoteReplyEmail({
                    id: selectedQuote.id,
                    product_name: selectedQuote.product_name,
                    contact_name: selectedQuote.contact_name,
                    contact_email: selectedQuote.contact_email,
                    quantity: selectedQuote.quantity,
                    description: selectedQuote.description,
                    type: selectedQuote.type
                }, info.response);

                if (!emailResult.success) {
                    toast.warning("Status updated, but failed to send email.");
                    console.error("Email Error:", emailResult.error);
                } else {
                    toast.success(`Quote updated & email sent to ${selectedQuote.contact_email}`);
                }
            } else {
                toast.success(`Quote marked as ${info.status}`);
            }

            fetchQuotes(); // Refresh list
            setSelectedQuote(null); // Close dialog
            setResponseText("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quote");
        } finally {
            setResponseLoading(false);
        }
    };

    const filteredQuotes = quotes.filter(q =>
        q.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Custom Quotes</h1>
                    <p className="text-gray-500 mt-1">Manage and respond to customer quote requests.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex gap-4 items-center">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search quotes, customers..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Product / Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredQuotes.map((quote) => (
                                <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize border shadow-sm
                                            ${quote.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                quote.status === 'responded' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{quote.product_name || "Custom Project"}</div>
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{quote.description}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">Qty: {quote.quantity}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{quote.contact_name}</div>
                                        <div className="text-xs text-slate-500">{quote.contact_email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(new Date(quote.created_at), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Dialog open={selectedQuote?.id === quote.id} onOpenChange={(open) => !open && setSelectedQuote(null)}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline" size="sm"
                                                    className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    onClick={() => {
                                                        setSelectedQuote(quote);
                                                        setResponseText(quote.admin_response || "");
                                                    }}
                                                >
                                                    View & Reply
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Quote Request Details</DialogTitle>
                                                    <DialogDescription>
                                                        Review request and send a response/price.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="grid grid-cols-2 gap-4 py-4">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500 uppercase">Product</Label>
                                                        <p className="font-medium">{quote.product_name}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500 uppercase">Type</Label>
                                                        <p className="font-medium capitalize">{quote.type}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500 uppercase">Quantity</Label>
                                                        <p className="font-medium">{quote.quantity}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500 uppercase">Material/Size/Finish</Label>
                                                        <p className="text-sm">
                                                            {quote.material || "-"} / {quote.size || "-"} / {quote.finish || "-"}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <Label className="text-xs text-gray-500 uppercase">Description</Label>
                                                        <p className="text-sm bg-gray-50 p-3 rounded-md border">{quote.description || "No description provided."}</p>
                                                    </div>
                                                    {quote.file_url && (
                                                        <div className="col-span-2 space-y-1">
                                                            <Label className="text-xs text-gray-500 uppercase">Reference File</Label>
                                                            <div className="flex items-center gap-2">
                                                                <a href={quote.file_url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                                                                    <Eye className="h-4 w-4" /> View Attached File
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="col-span-2 border-t pt-4 mt-2">
                                                        <Label className="mb-2 block">Admin Response / Pricing</Label>
                                                        <Textarea
                                                            placeholder="Enter your quote price and details here (e.g. 'We can do this for ₹5000...')"
                                                            value={responseText}
                                                            onChange={(e) => setResponseText(e.target.value)}
                                                            className="min-h-[100px]"
                                                        />
                                                    </div>
                                                </div>

                                                <DialogFooter className="gap-2 sm:gap-0">
                                                    <Button variant="outline" onClick={() => setSelectedQuote(null)}>Cancel</Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleUpdateStatus({ status: 'responded', response: responseText })}
                                                        disabled={responseLoading || !responseText}
                                                    >
                                                        {responseLoading ? "Sending..." : "Send Response"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
