export interface NavItem {
    title: string;
    href: string;
    description?: string;
}

export interface NavCategory {
    title: string;
    items: NavItem[];
}

export const PRODUCT_CATEGORIES: NavCategory[] = [
    {
        title: "Stickers & Labels",
        items: [
            { title: "Die-Cut Stickers", href: "/products/stickers/die-cut", description: "Individually cut to the exact shape of the design." },
            { title: "Kiss-Cut Stickers", href: "/products/stickers/kiss-cut", description: "Cut to shape but left on a square backing." },
            { title: "Holographic Stickers", href: "/products/stickers/holographic", description: "Printed on iridescent, rainbow-effect vinyl." },
            { title: "Clear Stickers", href: "/products/stickers/clear", description: "Printed on transparent vinyl for a no-label look." },
            { title: "Transfer Stickers", href: "/products/stickers/transfer", description: "Vinyl lettering with no background." },
            { title: "Bumper Stickers", href: "/products/stickers/bumper", description: "Weather-resistant with removable adhesive." },
            { title: "Roll Labels", href: "/products/labels/roll", description: "Stickers on a continuous core for machine application." },
            { title: "Sheet Labels", href: "/products/labels/sheet", description: "Multiple stickers printed on a standard size page." },
            { title: "Static Clings", href: "/products/stickers/static-cling", description: "Adhesive-free stickers for windows." },
            { title: "Floor Graphics", href: "/products/stickers/floor", description: "Durable, anti-slip stickers for walking surfaces." },
        ]
    },
    {
        title: "Books & Binding",
        items: [
            { title: "Saddle-Stitch Booklets", href: "/products/books/saddle-stitch", description: "Stapled binding for magazines and brochures." },
            { title: "Perfect Bound Books", href: "/products/books/perfect-bound", description: "Glued square spine for catalogs and paperbacks." },
            { title: "Spiral Bound Books", href: "/products/books/spiral", description: "Plastic coil binding, lays flat 360 degrees." },
            { title: "Wire-O Books", href: "/products/books/wire-o", description: "Twin-loop metal wire binding for reports." },
            { title: "Hardcover Books", href: "/products/books/hardcover", description: "Rigid cover for premium yearbooks or photobooks." },
            { title: "Custom Notebooks", href: "/products/books/notebooks", description: "Branded lined or grid pages with custom covers." },
        ]
    },
    {
        title: "Butter Paper & Packaging",
        items: [
            { title: "Custom Tissue Paper", href: "/products/packaging/tissue-paper", description: "Lightweight branding paper for unboxing." },
            { title: "Greaseproof Paper", href: "/products/packaging/greaseproof", description: "Food-safe butter paper for lining trays." },
            { title: "Wax Paper", href: "/products/packaging/wax-paper", description: "Moisture-resistant paper often used in delis." },
            { title: "Sandwich Wraps", href: "/products/packaging/sandwich-wraps", description: "Custom printed sheets for food service." },
            { title: "Mailer Boxes", href: "/products/packaging/mailer-boxes", description: "Corrugated boxes for shipping." },
            { title: "Poly Mailers", href: "/products/packaging/poly-mailers", description: "Lightweight, tear-proof shipping bags." },
        ]
    },
    {
        title: "Billbooks & Office",
        items: [
            { title: "NCR Forms (2-Part)", href: "/products/office/ncr-2-part", description: "White/Yellow carbonless sets." },
            { title: "NCR Forms (3-Part)", href: "/products/office/ncr-3-part", description: "White/Yellow/Pink carbonless sets." },
            { title: "Invoice Books", href: "/products/office/invoice-books", description: "Bound sets of NCR forms with covers." },
            { title: "Receipt Books", href: "/products/office/receipt-books", description: "Smaller format carbonless books." },
            { title: "Letterhead", href: "/products/office/letterhead", description: "Premium 70lb text or linen paper." },
            { title: "Envelopes", href: "/products/office/envelopes", description: "#10 Standard, Window, and Security Tint." },
            { title: "Notepads", href: "/products/office/notepads", description: "Glued-edge memo pads." },
        ]
    },
    {
        title: "Stamps",
        items: [
            { title: "Self-Inking Stamps", href: "/products/stamps/self-inking", description: "Built-in ink pad for rapid use." },
            { title: "Rubber Stamps", href: "/products/stamps/rubber", description: "Traditional stamps requiring a separate ink pad." },
            { title: "Signature Stamps", href: "/products/stamps/signature", description: "Custom signature reproduction." },
            { title: "Date Stamps", href: "/products/stamps/date", description: "Adjustable date bands." },
        ]
    },
    {
        title: "Business Cards",
        items: [
            { title: "Standard Cards", href: "/products/cards/standard", description: "14pt or 16pt cardstock." },
            { title: "Square Cards", href: "/products/cards/square", description: "2.5\" x 2.5\" unique format." },
            { title: "Cotton / Linen Cards", href: "/products/cards/textured", description: "Textured premium paper." },
            { title: "Spot UV Cards", href: "/products/cards/spot-uv", description: "Glossy coating on specific areas." },
            { title: "Foil Accent Cards", href: "/products/cards/foil", description: "Metallic gold or silver foil stamping." },
            { title: "NFC Business Cards", href: "/products/cards/nfc", description: "Smart cards with embedded chips." },
        ]
    },
    {
        title: "Marketing",
        items: [
            { title: "Vinyl Banners", href: "/products/marketing/vinyl-banners", description: "Durable outdoor banners with grommets." },
            { title: "Retractable Banners", href: "/products/marketing/retractable", description: "Roll-up stand banners for trade shows." },
            { title: "Yard Signs", href: "/products/marketing/yard-signs", description: "Corrugated plastic signs." },
            { title: "Foam Board Signs", href: "/products/marketing/foam-board", description: "Lightweight rigid signs for easels." },
            { title: "Aluminum Signs", href: "/products/marketing/aluminum", description: "Rust-proof metal parking/street signs." },
            { title: "Menus", href: "/products/marketing/menus", description: "Tri-fold, Bi-fold, and Synthetic menus." },
            { title: "Table Tents", href: "/products/marketing/table-tents", description: "Folded cards for table displays." },
            { title: "Door Hangers", href: "/products/marketing/door-hangers", description: "Die-cut marketing cards for door knobs." },
        ]
    }
];
