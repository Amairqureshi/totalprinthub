"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: any[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                <Image
                    src={urlFor(selectedImage).width(800).url()}
                    alt={title}
                    fill
                    className="object-contain p-4"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image._key || index}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50",
                                selectedImage === image
                                    ? "border-blue-600 ring-2 ring-blue-600 ring-offset-1"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={urlFor(image).width(200).url()}
                                alt={`${title} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
