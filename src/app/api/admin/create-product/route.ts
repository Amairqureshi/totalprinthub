
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
        const { config, selectedMaterial, selectedFinish, variants, shortDescription, longDescription, seo, featuredImageAssetId } = body;

        if (!process.env.SANITY_API_TOKEN) {
            return NextResponse.json({ error: 'Missing SANITY_API_TOKEN' }, { status: 500 });
        }

        const docName = `${config.name} - ${selectedMaterial.name}`;
        const slug = generateSlug(docName + '-' + Date.now().toString().slice(-4));

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

        const doc: any = {
            _type: 'product',
            title: docName,
            slug: { _type: 'slug', current: slug },

            // Priority: User Input -> Auto Generated Details
            shortDescription: shortDescription || `Configuration: ${selectedMaterial.name}, ${selectedFinish.name}. Available in ${variants.length} sizes.`,
            longDescription: descriptionBlocks,

            // Map keys
            variants: sanityVariants,
            availableMaterials: selectedMaterial.id ? [selectedMaterial.id] : [],
            availableShapes: ['die-cut', 'circle', 'square', 'custom'],
            availableCutTypes: ['individual', 'sheets'],

            // Media
            featuredImage: featuredImageAssetId ? {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: featuredImageAssetId
                }
            } : undefined,

            // SEO
            metaTitle: seo?.title || docName,
            metaDescription: seo?.description || shortDescription,
            keywords: seo?.keywords || [],

            // Fallback
            basePrice: 0,
            pricingTiers: [],
        };

        // Category Link
        const categoryQuery = `*[_type == "category"][0]._id`;
        const categoryId = await clientWithToken.fetch(categoryQuery);
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
