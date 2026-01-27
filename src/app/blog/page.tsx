import { getAllBlogPosts } from "@/lib/sanity/queries";
import { BlogList } from "@/components/blog/BlogList";

export const revalidate = 10; // Ensure fresh data (ISR 10s)

export default async function BlogPage() {
    const posts = await getAllBlogPosts();

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <BlogList initialPosts={posts} />
        </div>
    );
}
