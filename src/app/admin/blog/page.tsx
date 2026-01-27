"use client";

import { useEffect, useState } from "react";
import { getAllBlogPosts, SanityBlogPost } from "@/lib/sanity/queries";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Plus, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<SanityBlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getAllBlogPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch blog posts:", error);
            toast.error("Failed to load articles from Sanity.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog Articles</h1>
                    <p className="text-slate-500 text-sm">Manage your content via Sanity CMS. Changes here reflect on the live site.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchPosts} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Sync/Refresh
                    </Button>
                    <Button asChild className="bg-[#F03E2F] hover:bg-[#d6372a] text-white">
                        <Link href="https://www.sanity.io/manage" target="_blank">
                            <Plus className="h-4 w-4 mr-2" />
                            Create in Sanity
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search articles by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-slate-50 border-slate-200"
                    />
                </div>
                <div className="text-sm text-slate-500 font-medium px-4 border-l border-slate-100">
                    {posts.length} Articles Found
                </div>
            </div>

            {/* Blog Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 w-20">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Published</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-16 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-100 rounded mb-1"></div><div className="h-3 w-32 bg-slate-50 rounded"></div></td>
                                        <td colspan={4} className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No articles found. Create one in Sanity!
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="h-10 w-16 bg-slate-100 rounded overflow-hidden">
                                                {post.featuredImage?.asset?.url ? (
                                                    <img src={post.featuredImage.asset.url} className="h-full w-full object-cover" alt="" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-300 text-xs">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{post.title}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{post.slug.current}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                {post.category || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {post.author || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                            {format(new Date(post.publishedAt || new Date()), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-blue-600" asChild>
                                                <Link href={`/blog/${post.slug.current}`} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-slate-900" asChild>
                                                {/* Deep link if possible, else generic manage */}
                                                <Link href={`https://www.sanity.io/manage`} target="_blank">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
