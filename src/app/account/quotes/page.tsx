"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FileText, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Quote {
    id: string;
    type: string;
    product_name: string;
    status: string;
    created_at: string;
    admin_response: string;
    description: string;
    quantity: string;
    file_url?: string;
}

export default function UserQuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from("quotes")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (!error && data) {
                    setQuotes(data);
                }
            } catch (error) {
                console.error("Failed to load quotes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Custom Quotes</h1>
                    <p className="text-gray-500 mt-1">Track status and responses for your requests</p>
                </div>
                <Button asChild>
                    <Link href="/custom-quote">New Request</Link>
                </Button>
            </div>

            {quotes.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-gray-900">No requests found</h2>
                    <p className="text-gray-500 mb-6">You haven't submitted any custom quote requests yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {quotes.map((quote) => (
                        <div key={quote.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {quote.product_name || "Custom Request"}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase border ${quote.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            quote.status === 'responded' ? 'bg-green-50 text-green-700 border-green-200' :
                                                'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                            {quote.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                        {quote.description || "No description provided"}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>Requested on {format(new Date(quote.created_at), "PPP")}</span>
                                        <span>•</span>
                                        <span className="font-medium text-gray-900">Qty: {quote.quantity}</span>
                                        {quote.file_url && (
                                            <>
                                                <span>•</span>
                                                <a href={quote.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                    View Reference
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {quote.admin_response && (
                                    <div className="md:w-1/3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2 mb-1 text-blue-700 text-sm font-semibold">
                                            <MessageSquare className="h-4 w-4" />
                                            Admin Response:
                                        </div>
                                        <p className="text-sm text-gray-700">{quote.admin_response}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
