
import * as XLSX from 'xlsx';
import * as path from 'path';

// This creates an Excel file with FORMULAS that explain the pricing math
// User can easily adjust base costs and markup percentages

const wb = XLSX.utils.book_new();

// ============================================
// SHEET 1: PRICING CALCULATOR (with formulas)
// ============================================

const calculatorData = [
    ['STICKER PRICING CALCULATOR - KRAFTIX DIGITAL'],
    [''],
    ['PRICING PARAMETERS'],
    ['Base Cost per Sq Inch (₹)', 0.50, '← Adjust this based on material'],
    ['Setup Fee per Product (₹)', 50, '← One-time design/setup cost'],
    ['Your Markup %', 40, '← Your profit margin (e.g., 40% = 1.4x)'],
    [''],
    ['QUANTITY DISCOUNT TIERS'],
    ['Qty Range', 'Discount %', 'Description'],
    ['1-49', 0, 'Small orders - no discount'],
    ['50-99', 10, 'Tier 1 - 10% off'],
    ['100-249', 20, 'Tier 2 - 20% off'],
    ['250-499', 30, 'Tier 3 - 30% off'],
    ['500+', 40, 'Bulk - 40% off'],
    [''],
    ['HOW PRICING WORKS:'],
    ['1. Base Cost = (Width × Height in inches) × Cost per Sq Inch'],
    ['2. Material Cost = Base Cost × Material Multiplier (see Materials sheet)'],
    ['3. Quantity Discount Applied based on tier above'],
    ['4. Setup Fee distributed across quantity'],
    ['5. Your Markup added for final price'],
    [''],
    ['FORMULA EXAMPLE:'],
    ['For a 3" × 3" vinyl sticker, quantity 100:'],
    ['- Area = 3 × 3 = 9 sq inches'],
    ['- Base Cost = 9 × ₹0.50 = ₹4.50'],
    ['- Vinyl Multiplier = 1.5x → ₹6.75'],
    ['- Qty 100 gets 20% discount → ₹5.40 per sticker'],
    ['- Setup Fee ₹50 ÷ 100 = ₹0.50 per sticker'],
    ['- Cost per sticker = ₹5.90'],
    ['- With 40% markup → Final Price = ₹8.26 per sticker'],
];

const ws1 = XLSX.utils.aoa_to_sheet(calculatorData);
ws1['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 40 }];
XLSX.utils.book_append_sheet(wb, ws1, 'Pricing Guide');

// ============================================
// SHEET 2: MATERIAL MULTIPLIERS
// ============================================

const materialsData = [
    ['MATERIAL COST MULTIPLIERS'],
    [''],
    ['Material Type', 'Multiplier', 'Description', 'Typical Use'],
    ['Art Paper (Standard)', 1.0, 'Cheapest option', 'Indoor labels, basic stickers'],
    ['Uncoated Paper', 1.0, 'Natural finish', 'Eco-friendly labels'],
    ['Kraft Paper', 1.2, 'Rustic look', 'Artisan products, organic brands'],
    ['Premium Vinyl', 1.5, 'Durable, waterproof', 'Outdoor use, bottles'],
    ['Clear Vinyl', 1.8, 'Transparent background', 'Glass, premium packaging'],
    ['White Ink Clear', 2.0, 'White ink on clear', 'Premium transparent stickers'],
    ['Holographic', 2.5, 'Rainbow shine effect', 'Eye-catching branding'],
    ['Metallic Foil', 3.0, 'Gold/Silver finish', 'Luxury products'],
    ['3D UV Embossed', 4.0, 'Raised texture', 'Premium business cards'],
    ['3D Dome (Epoxy)', 6.0, 'Thick domed finish', 'High-end labels'],
    ['Metal Stickers', 5.0, 'Actual metal', 'Ultra-premium branding'],
    ['Reflective Vinyl', 4.5, 'Safety/visibility', 'Vehicle, safety labels'],
    ['Glow in Dark', 5.0, 'Phosphorescent', 'Novelty, safety'],
    ['DTF Transfer', 2.5, 'Fabric transfer', 'T-shirts, textiles'],
];

const ws2 = XLSX.utils.aoa_to_sheet(materialsData);
ws2['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 25 }, { wch: 30 }];
XLSX.utils.book_append_sheet(wb, ws2, 'Materials');

// ============================================
// SHEET 3: PRODUCT CATALOG WITH FORMULAS
// ============================================

const catalogHeaders = [
    'Product Name',
    'Category',
    'Material',
    'Base Multiplier',
    'Size (inches)',
    'Area (sq in)',
    'Min Qty',
    'Max Qty',
    'Qty Discount %',
    'Base Cost (₹)',
    'After Discount (₹)',
    'Setup Fee/Unit (₹)',
    'Total Cost (₹)',
    'Your Markup %',
    'Final Price (₹)',
    'Notes'
];

// Sample products with actual data (formulas will be in Excel)
const catalogRows = [
    // Standard Stickers
    ['Standard Stickers (Art Paper)', 'Paper Stickers', 'Art Paper', 1.0, '3×3', 9, 50, 99, 10, '=F2*$B$4*D2', '=J2*(1-I2/100)', '=$B$5/G2', '=K2+L2', '=$B$6/100', '=M2*(1+N2)', 'Most economical option'],
    ['Standard Stickers (Art Paper)', 'Paper Stickers', 'Art Paper', 1.0, '3×3', 9, 100, 249, 20, '=F3*$B$4*D3', '=J3*(1-I3/100)', '=$B$5/G3', '=K3+L3', '=$B$6/100', '=M3*(1+N3)', 'Tier 2 pricing'],
    ['Standard Stickers (Art Paper)', 'Paper Stickers', 'Art Paper', 1.0, '3×3', 9, 250, 499, 30, '=F4*$B$4*D4', '=J4*(1-I4/100)', '=$B$5/G4', '=K4+L4', '=$B$6/100', '=M4*(1+N4)', 'Tier 3 pricing'],

    // Premium Vinyl
    ['Premium Vinyl Stickers', 'Vinyl Stickers', 'Vinyl', 1.5, '3×3', 9, 50, 99, 10, '=F5*$B$4*D5', '=J5*(1-I5/100)', '=$B$5/G5', '=K5+L5', '=$B$6/100', '=M5*(1+N5)', 'Waterproof, durable'],
    ['Premium Vinyl Stickers', 'Vinyl Stickers', 'Vinyl', 1.5, '3×3', 9, 100, 249, 20, '=F6*$B$4*D6', '=J6*(1-I6/100)', '=$B$5/G6', '=K6+L6', '=$B$6/100', '=M6*(1+N6)', ''],

    // Clear Vinyl
    ['Clear Vinyl Stickers', 'Vinyl Stickers', 'Clear Vinyl', 1.8, '3×3', 9, 50, 99, 10, '=F7*$B$4*D7', '=J7*(1-I7/100)', '=$B$5/G7', '=K7+L7', '=$B$6/100', '=M7*(1+N7)', 'Transparent background'],

    // Holographic
    ['Holographic Stickers', 'Exclusive', 'Holographic', 2.5, '3×3', 9, 50, 99, 10, '=F8*$B$4*D8', '=J8*(1-I8/100)', '=$B$5/G8', '=K8+L8', '=$B$6/100', '=M8*(1+N8)', 'Rainbow shine effect'],

    // Different sizes
    ['Custom Round Stickers', 'Stickers', 'Vinyl', 1.5, '2×2', 4, 100, 249, 20, '=F9*$B$4*D9', '=J9*(1-I9/100)', '=$B$5/G9', '=K9+L9', '=$B$6/100', '=M9*(1+N9)', 'Small size'],
    ['Large Format Stickers', 'Stickers', 'Vinyl', 1.5, '6×6', 36, 50, 99, 10, '=F10*$B$4*D10', '=J10*(1-I10/100)', '=$B$5/G10', '=K10+L10', '=$B$6/100', '=M10*(1+N10)', 'Large size'],
];

const catalogData = [catalogHeaders, ...catalogRows];
const ws3 = XLSX.utils.aoa_to_sheet(catalogData);

// Set column widths
ws3['!cols'] = [
    { wch: 30 }, // Product Name
    { wch: 18 }, // Category
    { wch: 15 }, // Material
    { wch: 12 }, // Multiplier
    { wch: 12 }, // Size
    { wch: 10 }, // Area
    { wch: 8 },  // Min Qty
    { wch: 8 },  // Max Qty
    { wch: 12 }, // Discount %
    { wch: 12 }, // Base Cost
    { wch: 15 }, // After Discount
    { wch: 15 }, // Setup Fee
    { wch: 12 }, // Total Cost
    { wch: 12 }, // Markup %
    { wch: 12 }, // Final Price
    { wch: 25 }, // Notes
];

XLSX.utils.book_append_sheet(wb, ws3, 'Product Catalog');

// ============================================
// SHEET 4: COMPLETE STICKER LIST
// ============================================

const stickerListData = [
    ['ALL STICKER PRODUCTS - KRAFTIX DIGITAL'],
    ['Use this as reference to add to the Product Catalog sheet above'],
    [''],
    ['Product Name', 'Category', 'Recommended Material', 'Typical Size', 'Min Order Qty'],

    // Paper Stickers
    ['Standard Stickers', 'Paper Stickers', 'Art Paper', '3×3"', 50],
    ['Uncoated Paper Stickers', 'Paper Stickers', 'Uncoated Paper', '3×3"', 50],
    ['Kraft Paper Stickers', 'Paper Stickers', 'Kraft Paper', '3×3"', 50],
    ['Writeable Paper Stickers', 'Paper Stickers', 'Writeable Paper', '3×3"', 50],
    ['Gloss Laminated Stickers', 'Paper Stickers', 'Laminated Paper', '3×3"', 50],
    ['Matt Laminated Stickers', 'Paper Stickers', 'Laminated Paper', '3×3"', 50],

    // Vinyl Stickers
    ['Premium Vinyl Stickers', 'Vinyl Stickers', 'Vinyl', '3×3"', 50],
    ['Clear Vinyl Stickers', 'Vinyl Stickers', 'Clear Vinyl', '3×3"', 50],
    ['White-Ink Clear Stickers', 'Vinyl Stickers', 'Clear Vinyl + White', '3×3"', 50],
    ['Custom Shape Stickers', 'Vinyl Stickers', 'Vinyl', 'Custom', 50],
    ['Custom Round Stickers', 'Vinyl Stickers', 'Vinyl', '2-4" dia', 50],
    ['Square & Rectangle Stickers', 'Vinyl Stickers', 'Vinyl', '2×2" to 4×4"', 50],
    ['Die Cut Stickers', 'Vinyl Stickers', 'Vinyl', 'Custom', 50],
    ['Kiss Cut Stickers', 'Vinyl Stickers', 'Vinyl', 'Custom', 50],

    // Exclusive Stickers
    ['3D Raised & Embossed UV', 'Exclusive', 'UV Resin', '2×2"', 50],
    ['3D Dome Stickers', 'Exclusive', 'Epoxy Resin', '1-3"', 50],
    ['Metal Stickers', 'Exclusive', 'Metal', '2×2"', 50],
    ['Holographic Stickers', 'Exclusive', 'Holographic Vinyl', '3×3"', 50],
    ['Foil Stickers', 'Exclusive', 'Foil Film', '3×3"', 50],
    ['Gold & Silver Vinyl', 'Exclusive', 'Metallic Vinyl', '3×3"', 50],
    ['Retro Reflective', 'Exclusive', 'Reflective Vinyl', '3×3"', 50],
    ['Glow in the Dark', 'Exclusive', 'Phosphorescent', '3×3"', 50],
    ['Fluorescent Stickers', 'Exclusive', 'Neon Vinyl', '3×3"', 50],

    // Transfer Stickers
    ['Ink Transfer Stickers', 'Transfer', 'Transfer Film', 'Custom', 2],
    ['DTF Transfer (Fabric)', 'Transfer', 'DTF Film', 'Custom', 10],
    ['Vinyl Cut Decals', 'Transfer', 'Cut Vinyl', 'Custom', 10],
    ['Front Adhesive', 'Transfer', 'Clear Vinyl', 'Custom', 50],

    // Functional Labels
    ['Void Tamper Proof', 'Security', 'Destructible Vinyl', '1×2"', 100],
    ['Warranty Labels', 'Functional', 'Vinyl', '1×2"', 100],
    ['Product Labels', 'Functional', 'Vinyl', 'Custom', 100],
    ['Bottle & Jar Labels', 'Functional', 'Waterproof Vinyl', 'Custom', 100],
    ['Candle Labels', 'Functional', 'Heat Resistant', 'Custom', 50],
    ['Food Packaging Labels', 'Functional', 'Food Safe', 'Custom', 100],

    // Sheets
    ['White A4 Sticker Sheets', 'Sheets', 'Paper', 'A4', 10],
    ['Kiss Cut Sheets', 'Sheets', 'Vinyl', 'A4/A3', 10],
    ['Multiple Stickers Sheet', 'Sheets', 'Vinyl', 'Custom', 10],
];

const ws4 = XLSX.utils.aoa_to_sheet(stickerListData);
ws4['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 25 }, { wch: 15 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws4, 'All Stickers Reference');

// ============================================
// SHEET 5: INSTRUCTIONS
// ============================================

const instructionsData = [
    ['HOW TO USE THIS PRICING CALCULATOR'],
    [''],
    ['STEP 1: SET YOUR BASE PARAMETERS (Pricing Guide sheet)'],
    ['- Adjust "Base Cost per Sq Inch" based on your supplier costs'],
    ['- Set "Setup Fee" (one-time design/cutting cost)'],
    ['- Set "Your Markup %" (your profit margin)'],
    [''],
    ['STEP 2: UNDERSTAND MATERIAL MULTIPLIERS (Materials sheet)'],
    ['- Each material has a cost multiplier'],
    ['- Standard paper = 1.0x (baseline)'],
    ['- Premium materials = higher multiplier'],
    ['- Use this to understand relative costs'],
    [''],
    ['STEP 3: USE THE PRODUCT CATALOG (Product Catalog sheet)'],
    ['- Formulas are already set up'],
    ['- Column D: Material multiplier (from Materials sheet)'],
    ['- Column F: Area in square inches'],
    ['- Column I: Quantity discount % (from tier table)'],
    ['- Column O: Final price automatically calculated'],
    [''],
    ['STEP 4: ADD YOUR PRODUCTS'],
    ['- Copy a row in Product Catalog sheet'],
    ['- Change product name, material, size, quantity range'],
    ['- Formulas will auto-calculate prices'],
    ['- Use "All Stickers Reference" sheet for product ideas'],
    [''],
    ['PRICING FORMULA BREAKDOWN:'],
    [''],
    ['Base Cost = Area (sq in) × Base Cost per Sq In × Material Multiplier'],
    ['After Discount = Base Cost × (1 - Discount%)'],
    ['Setup Fee per Unit = Total Setup Fee ÷ Quantity'],
    ['Total Cost = After Discount + Setup Fee per Unit'],
    ['Final Price = Total Cost × (1 + Markup%)'],
    [''],
    ['EXAMPLE CALCULATION:'],
    ['Product: 3×3" Holographic Sticker, Qty 100'],
    ['- Area = 9 sq inches'],
    ['- Base = 9 × ₹0.50 × 2.5 (holo multiplier) = ₹11.25'],
    ['- Discount = 20% for qty 100 → ₹9.00'],
    ['- Setup = ₹50 ÷ 100 = ₹0.50'],
    ['- Cost = ₹9.50'],
    ['- With 40% markup = ₹13.30 final price'],
    [''],
    ['TIPS FOR PRICING:'],
    ['- Start with 30-50% markup for competitive pricing'],
    ['- Increase markup for exclusive/premium products'],
    ['- Consider competitor pricing in your market'],
    ['- Bulk orders can have lower markup % but higher total profit'],
    ['- Factor in shipping, packaging, and handling costs'],
];

const ws5 = XLSX.utils.aoa_to_sheet(instructionsData);
ws5['!cols'] = [{ wch: 70 }];
XLSX.utils.book_append_sheet(wb, ws5, 'Instructions');

// Write the file
const xlsxPath = path.resolve(process.cwd(), 'sticker_pricing_calculator.xlsx');
XLSX.writeFile(wb, xlsxPath);

console.log('✅ Created: sticker_pricing_calculator.xlsx');
console.log('📊 This file includes:');
console.log('   - Pricing Guide with adjustable parameters');
console.log('   - Material cost multipliers');
console.log('   - Product catalog with FORMULAS');
console.log('   - Complete sticker reference list');
console.log('   - Detailed instructions');
console.log('');
console.log('💡 Open in Excel to see formulas and adjust your pricing!');
