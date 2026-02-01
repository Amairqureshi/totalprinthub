
import { NextResponse } from 'next/server';
import { clientWithToken } from '@/lib/sanity/client';

function generateSlug(text: string) {
    return text.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // New Payload Structure from ProductEditor.tsx
        const {
            title,
            slug,
            category,
            shortDescription,
            longDescription,
            availableMaterials,
            availableShapes,
            availableCutTypes,
            variants,
            featuredImageAssetId,
            galleryAssetIds, // New
            seo,
            basePrice
        } = body;

        if (!process.env.SANITY_API_TOKEN) {
            return NextResponse.json({ error: 'Missing SANITY_API_TOKEN' }, { status: 500 });
        }

        const generatedSlug = slug || generateSlug(title + '-' + Date.now().toString().slice(-4));

        // Map UI variants to Sanity Schema
        const sanityVariants = variants.map((v: any) => ({
            _key: v.id,
            name: v.name,
            width: v.width,
            height: v.height,
            pricingTiers: v.tiers.map((t: any) => ({
                _key: Math.random().toString(36).substring(7),
                minQty: t.min,
                maxQty: t.max,
                pricePerUnit: t.price
            }))
        }));

        // Convert plain text long description to Sanity Block Content
        const descriptionBlocks = longDescription ? [
            {
                _type: 'block',
                _key: Math.random().toString(36).substring(7),
                children: [
                    { _type: 'span', text: longDescription }
                ]
            }
        ] : [];

        // Gallery Images
        const productImages = galleryAssetIds?.map((id: string) => ({
            _type: 'image',
            _key: id,
            asset: {
                _type: 'reference',
                _ref: id
            }
        })) || [];

        const doc: any = {
            _type: 'product',
            title: title,
            slug: { _type: 'slug', current: generatedSlug },

            shortDescription: shortDescription || `Custom printed ${title}`,
            longDescription: descriptionBlocks,

            // Config
            availableMaterials: availableMaterials || [],
            availableShapes: availableShapes || [],
            availableCutTypes: availableCutTypes || [],

            // Pricing
            basePrice: basePrice || 99,
            variants: sanityVariants,

            // Media
            featuredImage: featuredImageAssetId ? {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: featuredImageAssetId
                }
            } : undefined,
            productImages: productImages, // Gallery

            // SEO
            metaTitle: seo?.title || title,
            metaDescription: seo?.description || shortDescription,
            keywords: seo?.keywords || [],

            hasBackSide: false, // Default
            publishedAt: new Date().toISOString()
        };

        // Category Link
        // Try to find category by name, else default to first one
        const categoryQuery = `*[_type == "category" && title match "${category}"][0]._id`;
        let categoryId = await clientWithToken.fetch(categoryQuery);

        if (!categoryId) {
            const defaultCat = await clientWithToken.fetch(`*[_type == "category"][0]._id`);
            categoryId = defaultCat;
        }

        if (categoryId) {
            doc.category = { _type: 'reference', _ref: categoryId };
        }

        const created = await clientWithToken.create(doc);

        return NextResponse.json({ success: true, id: created._id, title: created.title });
    } catch (error: any) {
        console.error('Sanity Create Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
