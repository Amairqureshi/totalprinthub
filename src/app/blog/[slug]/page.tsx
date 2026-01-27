import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/sanity/queries";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/client";

export const revalidate = 60;

export async function generateStaticParams() {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
        slug: post.slug.current,
    }));
}

// Custom components for Portable Text
const ptComponents: PortableTextComponents = {
    types: {
        image: ({ value }: any) => {
            if (!value?.asset?._ref) {
                return null;
            }
            return (
                <div className="my-8 rounded-xl overflow-hidden shadow-sm">
                    <img
                        src={urlFor(value).width(800).fit('max').auto('format').url()}
                        alt={value.alt || 'Article Image'}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                    />
                    {value.caption && (
                        <p className="text-center text-sm text-gray-500 mt-2 italic">
                            {value.caption}
                        </p>
                    )}
                </div>
            );
        },
    },
    block: {
        h1: ({ children }: any) => <h1 className="text-3xl font-bold text-slate-900 mt-10 mb-4">{children}</h1>,
        h2: ({ children }: any) => <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">{children}</h2>,
        h3: ({ children }: any) => <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">{children}</h3>,
        h4: ({ children }: any) => <h4 className="text-lg font-bold text-slate-900 mt-6 mb-3">{children}</h4>,
        normal: ({ children }: any) => <p className="mb-4 text-slate-600 leading-relaxed text-lg">{children}</p>,
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50/50 rounded-r-lg my-8 italic text-slate-700">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }: any) => <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">{children}</ul>,
        number: ({ children }: any) => <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-600">{children}</ol>,
    },
    marks: {
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
            return (
                <a
                    href={value.href}
                    rel={rel}
                    className="text-blue-600 hover:underline font-medium"
                >
                    {children}
                </a>
            );
        },
    },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        // Fallback for Demo / Static checking if Sanity empty
        if (slug === "choosing-right-adhesive-industrial-use") {
            return <MockPost slug={slug} />
        }
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 text-sm text-slate-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-blue-600">Home</Link> /
                    <Link href="/blog" className="hover:text-blue-600">Blog</Link> /
                    <span className="text-slate-900 font-medium truncate">{post.title}</span>
                </div>
            </div>

            <article className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{post.category || "General"}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight max-w-3xl mx-auto">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {post.author[0]}
                                    </div>
                                </div>
                                <span className="font-medium text-slate-900">{post.author}</span>
                            </div>
                        )}
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(post.publishedAt || new Date()), "MMM dd, yyyy")}</span>
                    </div>
                </div>

                {/* Featured Image */}
                {post.featuredImage && (
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-lg bg-gray-100">
                        <img
                            src={post.featuredImage.asset.url}
                            alt={post.featuredImage.alt || post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content - WITH PROPER PORTABLE TEXT RENDERING */}
                <div className="prose prose-lg prose-slate max-w-none px-4 md:px-0">
                    {post.body && (
                        <PortableText value={post.body} components={ptComponents} />
                    )}

                    {!post.body && post.summary && (
                        <div dangerouslySetInnerHTML={{ __html: post.summary }} />
                    )}
                </div>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share This Article</span>
                    <div className="flex gap-2">
                        <Button size="sm" className="bg-[#1877F2] hover:bg-[#166fe5] text-white gap-2"><Facebook className="h-4 w-4" /> Facebook</Button>
                        <Button size="sm" className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white gap-2"><Twitter className="h-4 w-4" /> Twitter</Button>
                    </div>
                </div>
            </article>
        </div>
    );
}

function MockPost({ slug }: { slug: string }) {
    // Hardcoded match for the specific example in design
    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold">Static Demo Content</h1>
                <p>Fetching real content for {slug} failed or not in Sanity yet.</p>
            </div>
        </div>
    )
}
