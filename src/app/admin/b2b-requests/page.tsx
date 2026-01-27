import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Mail, Phone, Calendar, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminB2BRequestsPage() {
    const supabase = createClient();
    const { data: requests } = await supabase
        .from("b2b_requests")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">B2B Leads</h1>
                    <p className="text-slate-500">Manage incoming B2B pricing requests.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">WhatsApp</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {requests?.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {format(new Date(req.created_at), "MMM d, yyyy")}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        {req.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        {req.whatsapp}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {req.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!requests || requests.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No requests found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
