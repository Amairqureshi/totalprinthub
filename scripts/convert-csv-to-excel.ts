
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const CSV_FILE = 'kraftix_full_catalog.csv';
const EXCEL_FILE = 'kraftix_full_catalog_converted.xlsx';

const csvPath = path.resolve(process.cwd(), CSV_FILE);

if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
}

const workbook = XLSX.readFile(csvPath);
const sheetName = workbook.SheetNames[0];
const ws = workbook.Sheets[sheetName];

// Make it look nice
// 1. Auto-width columns based on content (simple approximation)
const range = XLSX.utils.decode_range(ws['!ref'] || "A1:H1");
const wscols = [];
for (let C = range.s.c; C <= range.e.c; ++C) {
    wscols.push({ wch: 20 }); // Default width
}
// Specific widths
wscols[0] = { wch: 35 }; // Title
wscols[1] = { wch: 20 }; // Category
wscols[2] = { wch: 15 }; // Material
wscols[3] = { wch: 15 }; // Finish
wscols[4] = { wch: 15 }; // Shape

ws['!cols'] = wscols;

const newWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWb, ws, 'Catalog');

const excelPath = path.resolve(process.cwd(), EXCEL_FILE);
XLSX.writeFile(newWb, excelPath);

console.log(`Successfully converted CSV to Excel at: ${excelPath}`);
