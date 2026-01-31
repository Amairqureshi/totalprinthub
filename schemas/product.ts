import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fieldsets: [
        { name: 'basic', title: '📝 Basic Info', options: { collapsible: true, collapsed: false } },
        { name: 'pricing', title: '💰 Pricing & Variants', options: { collapsible: true, collapsed: true } },
        { name: 'configuration', title: '⚙️ Configuration Options', options: { collapsible: true, collapsed: true } },
        { name: 'media', title: '🖼️ Media', options: { collapsible: true, collapsed: true } },
        { name: 'seo', title: '🔍 SEO & Metadata', options: { collapsible: true, collapsed: true } },
    ],
    fields: [
        // --- BASIC INFO ---
        defineField({
            name: 'title',
            title: 'Product Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            fieldset: 'basic',
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
            fieldset: 'basic',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
            fieldset: 'basic',
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required(),
            fieldset: 'basic',
        }),
        defineField({
            name: 'longDescription',
            title: 'Long Description',
            type: 'array',
            of: [{ type: 'block' }],
            fieldset: 'basic',
        }),
        defineField({
            name: 'hasBackSide',
            title: 'Has Back Side?',
            type: 'boolean',
            description: 'Enable if this product supports double-sided printing (e.g., Business Cards)',
            initialValue: false,
            fieldset: 'basic',
        }),

        // --- CONFIGURATION OPTIONS (NEW) ---
        defineField({
            name: 'availableMaterials',
            title: 'Available Materials',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Art Card Gloss (250gsm)', value: 'gloss_250' },
                    { title: 'Art Card Matt (270gsm)', value: 'matt_270' },
                    { title: 'Heavy Matt (350gsm)', value: 'matt_350' },
                    { title: 'Velvet Touch (370gsm)', value: 'velvet_370' },
                    { title: 'Classic Ivory (370gsm)', value: 'ivory_370' },
                    { title: 'Ultra Thick (450gsm)', value: 'thick_450' },
                    { title: 'Non-Tearable', value: 'non_tearable' },
                ]
            },
            description: 'Select valid materials for this product. Leave empty to use all defaults.',
            fieldset: 'configuration',
        }),
        defineField({
            name: 'availableShapes',
            title: 'Available Shapes',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Die Cut', value: 'die-cut' },
                    { title: 'Circle', value: 'circle' },
                    { title: 'Square', value: 'square' },
                    { title: 'Custom', value: 'custom' },
                    { title: 'Rectangle', value: 'rectangle' },
                    { title: 'Rounded Corners', value: 'rounded' },
                ]
            },
            description: 'Select valid shapes. Leave empty for defaults.',
            fieldset: 'configuration',
        }),
        defineField({
            name: 'availableCutTypes',
            title: 'Cut Types',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Details Cut (Individual)', value: 'individual' },
                    { title: 'Kiss Cut (Sheets)', value: 'sheets' },
                ]
            },
            fieldset: 'configuration',
        }),

        // --- PRICING & VARIANTS ---
        defineField({
            name: 'basePrice',
            title: 'Base Price (Starting At)',
            type: 'number',
            description: 'Starting price for display purposes (e.g., ₹99)',
            fieldset: 'pricing',
        }),
        defineField({
            name: 'variants',
            title: 'Size Variants',
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
            ],
            fieldset: 'pricing',
        }),
        defineField({
            name: 'pricingTiers',
            title: 'Legacy Pricing Tiers',
            type: 'array',
            hidden: true,
            of: [{ type: 'object', fields: [{ name: 'temp', type: 'string' }] }],
            fieldset: 'pricing',
        }),

        // --- MEDIA ---
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                { name: 'alt', type: 'string', title: 'Alternative Text' },
            ],
            fieldset: 'media',
        }),
        defineField({
            name: 'productImages',
            title: 'Gallery Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', type: 'string', title: 'Alternative Text' },
                    ],
                },
            ],
            fieldset: 'media',
        }),

        // --- SEO ---
        defineField({
            name: 'metaTitle',
            title: 'Meta Title',
            type: 'string',
            description: 'SEO title (max 60 characters)',
            fieldset: 'seo',
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description',
            type: 'text',
            rows: 3,
            description: 'SEO description (max 160 characters)',
            fieldset: 'seo',
        }),
        defineField({
            name: 'canonicalUrl',
            title: 'Canonical URL',
            type: 'url',
            fieldset: 'seo',
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            fieldset: 'seo',
        }),
        defineField({
            name: 'schemaJSON',
            title: 'Schema.org JSON-LD',
            type: 'text',
            rows: 10,
            fieldset: 'seo',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            fieldset: 'seo',
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
