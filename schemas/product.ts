import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        // SEO Critical Fields
        defineField({
            name: 'title',
            title: 'Product Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'SEO title (max 60 characters)',
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            description: 'SEO description (max 160 characters)',
            rows: 3,
        }),
        defineField({
            name: 'canonicalUrl',
            title: 'Canonical URL',
            type: 'url',
            description: 'Canonical URL for SEO',
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'SEO keywords',
        }),

        // Content Fields
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'longDescription',
            title: 'Long Description',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
            ],
        }),

        // Taxonomy
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'hasBackSide',
            title: 'Has Back Side?',
            type: 'boolean',
            description: 'Enable if this product supports double-sided printing (e.g., Business Cards)',
            initialValue: false,
        }),

        // Pricing & Variants
        defineField({
            name: 'variants',
            title: 'Product Variants (Sizes)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Variant Name (e.g. "3x3 inch")', type: 'string' },
                        { name: 'width', title: 'Width', type: 'number' },
                        { name: 'height', title: 'Height', type: 'number' },
                        {
                            name: 'pricingTiers',
                            title: 'Pricing Tiers',
                            type: 'array',
                            of: [{
                                type: 'object',
                                fields: [
                                    { name: 'minQty', title: 'Min Qty', type: 'number' },
                                    { name: 'maxQty', title: 'Max Qty', type: 'number' },
                                    { name: 'pricePerUnit', title: 'Price (₹)', type: 'number' },
                                ]
                            }]
                        }
                    ],
                    preview: {
                        select: { title: 'name', price: 'pricingTiers.0.pricePerUnit' },
                        prepare({ title, price }) {
                            return { title, subtitle: `Starts at ₹${price}` }
                        }
                    }
                }
            ]
        }),

        // Legacy Pricing (Deprecated)
        defineField({
            name: 'basePrice',
            title: 'Base Price (Legacy)',
            type: 'number',
            hidden: true,
        }),
        defineField({
            name: 'pricingTiers',
            title: 'Pricing Tiers (Legacy)',
            type: 'array',
            hidden: true,
            of: [{ type: 'object', fields: [{ name: 'temp', type: 'string' }] }] // Placeholder to avoid breaking if data exists
        }),

        // Images
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
        }),
        defineField({
            name: 'productImages',
            title: 'Product Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative Text',
                        },
                    ],
                },
            ],
        }),

        // Schema & Publishing
        defineField({
            name: 'schemaJSON',
            title: 'Schema.org JSON-LD',
            type: 'text',
            description: 'Product schema for rich snippets',
            rows: 10,
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
        }),
    ],

    preview: {
        select: {
            title: 'title',
            media: 'featuredImage',
            category: 'category.title',
        },
        prepare({ title, media, category }) {
            return {
                title,
                subtitle: category,
                media,
            }
        },
    },
})
