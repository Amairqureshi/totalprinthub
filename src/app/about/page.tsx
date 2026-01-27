
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - TotalPrintHub",
    description: "Learn about TotalPrintHub, your partner for custom printing solutions in India.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50/30">
            

            {/* Hero */}
            <div className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Empowering businesses across India with premium, custom printing solutions delivered with speed and precision.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                        <div className="prose prose-lg text-gray-600">
                            <p>
                                TotalPrintHub was founded with a simple mission: to make high-quality custom printing accessible, affordable, and easy for everyone. Whether you are a small startup looking for your first set of business cards or a large enterprise needing bulk marketing materials, we have the technology and expertise to deliver.
                            </p>
                            <p className="mt-4">
                                Based in India, we understand the local market's need for speed and reliability. That's why we've built a robust supply chain and a state-of-the-art online platform that provides instant quotes and transparent pricing.
                            </p>
                        </div>
                    </section>

                    <section className="grid sm:grid-cols-3 gap-8 text-center border-y border-gray-200 py-12">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
                            <div className="text-gray-600 font-medium">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">5M+</div>
                            <div className="text-gray-600 font-medium">Prints Delivered</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">24h</div>
                            <div className="text-gray-600 font-medium">Avg. Turnaround</div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">1</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
                                    <p className="text-gray-600">We never compromise on materials or print quality. Every order is checked before dispatch.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">2</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Obsession</h3>
                                    <p className="text-gray-600">We support you at every step, from file design to delivery tracking.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">3</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
                                    <p className="text-gray-600">No hidden fees. What you see on the quote is what you pay.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
