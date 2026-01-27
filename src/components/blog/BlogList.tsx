"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, LayoutGrid, List, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SanityBlogPost } from "@/lib/sanity/queries";

// Categories from Sanity or hardcoded common ones? 
// Ideally fetch from Sanity Categories too, but hardcoded matching Reference Image is cleaner for now.
const CATEGORIES = ["All Posts", "Design Tips", "Material Guides", "Business Branding", "Tutorials", "Case Studies", "Company"];

interface BlogListProps {
    initialPosts: SanityBlogPost[];
}

export function BlogList({ initialPosts }: BlogListProps) {
    const [activeCategory, setActiveCategory] = useState("All Posts");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter Logic
    const filteredPosts = initialPosts.filter(post => {
        const matchesCategory = activeCategory === "All Posts" || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const listPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : []; // First one is featured

    return (
        <>
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 pb-8 pt-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Knowledge Base & Blog</h1>
                            <p className="text-slate-500 max-w-xl">Expert advice on labels, stickers, and branding strategies to help your business stand out and scale efficiently.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search knowledge base..."
                                    className="pl-9 w-full md:w-64 bg-gray-50 border-gray-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6">My Account</Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Filter By:</span>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">

                {initialPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">No Articles Found</h2>
                        <p className="text-gray-500 mt-2">Create your first article in the Sanity Studio!</p>
                        <Button asChild className="mt-4 bg-blue-600 text-white">
                            <Link href="/studio">Go to Studio</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featuredPost && activeCategory === "All Posts" && !searchTerm && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-16 flex flex-col lg:flex-row gap-8 items-center cursor-pointer group">
                                <div className="w-full lg:w-1/2 aspect-[4/3] rounded-xl overflow-hidden relative">
                                    {featuredPost.featuredImage?.asset?.url ? (
                                        <img
                                            src={featuredPost.featuredImage.asset.url}
                                            alt={featuredPost.featuredImage.alt || featuredPost.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                </div>
                                <div className="w-full lg:w-1/2 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{featuredPost.category || "General"}</span>
                                        <span className="text-xs text-gray-400 font-medium">5 min read</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-lg text-slate-500 leading-relaxed line-clamp-3">
                                        {featuredPost.summary}
                                    </p>
                                    <Link href={`/blog/${featuredPost.slug.current}`}>
                                        <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-lg font-bold text-base">
                                            Read Full Guide <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Latest Articles Grid */}
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-900">
                                {searchTerm ? `Results for "${searchTerm}"` : (activeCategory === "All Posts" ? "Latest Articles" : activeCategory)}
                            </h3>
                            <div className="hidden md:flex bg-white rounded-lg border border-gray-200 p-1">
                                <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600"><LayoutGrid className="h-5 w-5" /></button>
                                <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400"><List className="h-5 w-5" /></button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* If searching or filtering, show ALL matches. If default view, show slice(1) to avoid duplicate featured */}
                            {(activeCategory === "All Posts" && !searchTerm ? listPosts : filteredPosts).map((article) => (
                                <Link href={`/blog/${article.slug.current}`} key={article._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="aspect-[16/9] overflow-hidden relative bg-slate-100">
                                        {article.category && (
                                            <span className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm z-10">
                                                {article.category}
                                            </span>
                                        )}
                                        {article.featuredImage?.asset?.url ? (
                                            <img
                                                src={article.featuredImage.asset.url}
                                                alt={article.featuredImage.alt || article.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{article.title}</h4>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{article.summary}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                {format(new Date(article.publishedAt || new Date()), "MMM dd")}
                                            </span>
                                            <span className="text-xs font-bold text-blue-500 flex items-center group-hover:translate-x-1 transition-transform">
                                                READ MORE <ArrowRight className="ml-1 h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {(activeCategory === "All Posts" && !searchTerm ? listPosts : filteredPosts).length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No articles match your filter.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="bg-gray-100 py-16 mt-12">
                {/* ... (Same as before) ... */}
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <div className="bg-blue-50/50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-sm">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Get labeling tips in your inbox</h3>
                        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Join 10,000+ businesses receiving our weekly guide to better branding.</p>

                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <Input placeholder="work-email@company.com" className="bg-white border-gray-200 h-12" />
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 px-8">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
