export type PriceLookup = {
    [key: string]: number; // Quantity -> Total Price
};

export type ProductPricing = {
    [paperType: string]: {
        [option: string]: PriceLookup;
    };
};

export const PRICING_DATA: {
    visiting_cards: ProductPricing;
    letterheads: ProductPricing;
    envelopes: ProductPricing;
} = {
    visiting_cards: {
        // Mapping Codes: AT=Gloss 250, AM=Matt 270, AC=Matt 350, VL=Velvet, EV=Eco Ivory, IV=Ivory, TI=Thick
        // Basic Option
        "gloss_250": {
            "basic": { "100": 94, "200": 181, "500": 335, "1000": 343 },
            "spot_uv": { "100": 145, "200": 280 },
            "foil": { "100": 380 }
        },
        "matt_270": {
            "basic": { "100": 119, "200": 230, "500": 426, "1000": 490 },
            "spot_uv": { "100": 268, "200": 517 },
            "foil": { "100": 272 }
        },
        "matt_350": {
            "basic": { "100": 231, "200": 446, "500": 825, "1000": 568 },
            "spot_uv": { "100": 160, "200": 308 },
            "foil": { "100": 297 }
        },
        "velvet_370": {
            "basic": { "100": 140, "200": 270, "500": 500, "1000": 1214 },
            "spot_uv": { "100": 185, "200": 356 },
            "foil": { "100": 345 }
        },
        "eco_ivory_410": {
            "basic": { "100": 162, "200": 313, "500": 579, "1000": 668 },
            "spot_uv": { "100": 162, "200": 313 }
        },
        "ivory_370": {
            "basic": { "100": 133, "200": 256, "500": 474, "1000": 773 },
            "spot_uv": { "100": 233, "200": 450 }
        },
        "thick_450": {
            "basic": { "100": 200, "200": 385, "500": 713, "1000": 792 },
            "spot_uv": { "100": 326, "200": 628 },
            "foil": { "100": 404 }
        },
        "non_tearable": {
            "basic": { "1000": 581 }
        }
    },
    letterheads: {
        "alabaster_100": {
            "basic": { "1000": 1150, "2000": 2200, "4000": 4200 }
        },
        "excel_bond_100": {
            "basic": { "1000": 1350, "2000": 2600, "4000": 5000 }
        },
        "super_sunshine_100": {
            "basic": { "1000": 1270, "2000": 2440, "4000": 4680 }
        },
        "art_paper_90": {
            "basic": { "1000": 1250, "2000": 2400, "4000": 4600 }
        },
        "art_paper_130": {
            "basic": { "1000": 1399, "2000": 2698, "4000": 5196 }
        }
    },
    envelopes: {
        // Envelopes have Size + Paper. Simplified structure for this map (Paper_Size keys)
        "alabaster_100_9x4": { "basic": { "1000": 1450 } },
        "alabaster_100_8x5": { "basic": { "1000": 2598 } },
        "alabaster_100_9x12": { "basic": { "1000": 6646 } },

        "super_sunshine_100_9x4": { "basic": { "1000": 1570 } },
        "super_sunshine_100_8x5": { "basic": { "1000": 2787 } },
        "super_sunshine_100_9x12": { "basic": { "1000": 7286 } },

        "art_paper_130_9x4": { "basic": { "1000": 1699 } },
        "art_paper_130_8x5": { "basic": { "1000": 2906 } },
        "art_paper_130_9x12": { "basic": { "1000": 7603 } }
    }
};
