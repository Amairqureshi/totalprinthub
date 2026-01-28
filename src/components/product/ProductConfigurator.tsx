"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2, Link as LinkIcon, FileIcon, Check, ArrowRight, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, ChevronsUpDown, HelpCircle, Info, Edit2, MoreVertical, X, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDynamicPrice } from "@/hooks/useDynamicPrice";
import { formatPrice } from "@/lib/utils";
import { PricingTier } from "@/lib/pricing/calculator";
import { useCart } from "@/components/providers/CartProvider";
import { useCartEditMode } from "@/hooks/useCartEditMode";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PRICING_DATA } from "@/lib/pricing/data";

// --------------------------------------------------------------------------------
// Data Constants
// --------------------------------------------------------------------------------
const SIZES = [
    { value: "standard", label: "Standard (3.5\" x 2\")" },
    { value: "square", label: "Square (2.5\" x 2.5\")" },
    { value: "slim", label: "Slim (3.5\" x 1.75\")" },
];

const STANDARD_MATERIALS = [
    { id: "gloss_250", name: "Art Card Gloss", desc: "250gsm Standard", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=60" },
    { id: "matt_270", name: "Art Card Matt", desc: "270gsm Smooth", img: "https://images.unsplash.com/photo-1586075010923-2dd450e5e556?w=400&q=60" },
    { id: "matt_350", name: "Heavy Matt", desc: "350gsm Premium", img: "https://images.unsplash.com/photo-1626128665085-483747621778?w=400&q=60" },
];

const PREMIUM_MATERIALS = [
    { id: "velvet_370", name: "Velvet Touch", desc: "370gsm Soft", img: "https://images.unsplash.com/photo-1542614471-001ccf2b449c?w=400&q=60" },
    { id: "ivory_370", name: "Classic Ivory", desc: "370gsm Textured", img: "https://images.unsplash.com/photo-1517646331032-9e8563c523a1?w=400&q=60" },
    { id: "thick_450", name: "Ultra Thick", desc: "450gsm Rigid", img: "https://images.unsplash.com/photo-1534942255761-c8846da5c6f9?w=400&q=60" },
    { id: "non_tearable", name: "Non-Tearable", desc: "Waterproof", img: "https://images.unsplash.com/photo-1589330694653-46adbd465e50?w=400&q=60" },
];

const FORMATS = [
    { value: "sheets", label: "Supplied in Sheets" },
    { value: "individual", label: "Fully Die-Cut (Individual)" },
];

// Helper to get price from data
const getRealPrice = (paper: string, qty: number, option: string = "basic") => {
    const productData = PRICING_DATA.visiting_cards;
    const paperData = productData[paper as keyof typeof productData];

    if (!paperData) return 0;

    const optionData = paperData[option as keyof typeof paperData] || paperData["basic"];

    // Find exact match 
    if (optionData[String(qty)]) {
        return optionData[String(qty)];
    }

    return 0; // Fallback
};



const SUPPORTED_EXTENSIONS = [
    "jpg", "jpeg", "png", "gif", "pdf", "ai", "eps", "psd", "tiff", "svg"
];

const INSTRUCTION_TAGS = [
    "Add White Ink", "Keep Margin", "Cut to Shape", "Pantone Matching", "Send Proof"
];

// --------------------------------------------------------------------------------
// Schemas & Types
// --------------------------------------------------------------------------------

const configuratorSchema = z.object({
    quantity: z.number().min(1, "Minimum quantity is 1"),
    paperType: z.string(),
    size: z.string(),
    format: z.string(),
    printingTime: z.enum(["standard", "express"]),
    customWidth: z.number().optional(),
    customHeight: z.number().optional(),
}).refine((data) => {
    if (data.size === "custom") {
        return !!data.customWidth && !!data.customHeight;
    }
    return true;
}, {
    message: "Dimensions required for custom size",
    path: ["customWidth"],
});

type ConfiguratorFormData = z.infer<typeof configuratorSchema>;

interface Job {
    id: string;
    name: string;
    file: File | null;
    preview: string | null;
    fileName: string | null;
    instructions: string;
    activeTags: string[];
    externalLink: string;
    isOpen: boolean; // Track open state individually for Grid 
}

interface ProductConfiguratorProps {
    productId?: string;
    productName?: string;
    productCategory?: string;
    productSlug?: string;
    pricingTiers?: PricingTier[];
    hasBackSide?: boolean; // Prop kept for TS compatibility but unused logic
}

export default function ProductConfigurator({
    productId,
    productName = "Custom Product",
    productCategory = "custom",
    productSlug = "custom",
    pricingTiers,
}: ProductConfiguratorProps) {
    const [step, setStep] = useState<1 | 2>(1); // 1: Config, 2: Jobs

    // Jobs State
    const [jobs, setJobs] = useState<Job[]>([
        { id: 'job-1', name: '', file: null, preview: null, fileName: null, instructions: '', activeTags: [], externalLink: '', isOpen: true }
    ]);

    // Selectors State
    const [openSizeCombo, setOpenSizeCombo] = useState(false);

    // Hooks
    const { editingItemId, editingItem, isEditMode } = useCartEditMode();
    const { addToCart, updateCartItem } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<ConfiguratorFormData>({
        resolver: zodResolver(configuratorSchema),
        defaultValues: {
            quantity: 100,
            paperType: "gloss_250",
            size: "standard",
            format: "sheets",
            printingTime: "standard",
        },
    });

    const quantity = watch("quantity");
    const paperType = watch("paperType");
    const size = watch("size");
    const format = watch("format");
    const printingTime = watch("printingTime");

    useEffect(() => {
        if (isEditMode && editingItem) {
            setValue("quantity", editingItem.configuration.quantity);
            setValue("paperType", editingItem.configuration.paperType as any);
            setValue("size", editingItem.configuration.size as any);
            setValue("format", editingItem.configuration.format || "sheets");
            setValue("printingTime", editingItem.configuration.printingTime || "standard");

            setJobs([{
                id: 'job-edit',
                name: editingItem.productName,
                file: null,
                preview: editingItem.configuration.design_url || null,
                fileName: "Existing File",
                instructions: editingItem.configuration.jobInstructions || "",
                activeTags: [],
                externalLink: editingItem.configuration.external_file_url || '',
                isOpen: true
            }]);
        }
    }, [isEditMode, editingItem, setValue]);

    const calculatePrice = () => {
        // Assume "basic" option for now. In real app, this comes from UI state (spot UV etc)
        const option = "basic";

        const totalForQty = getRealPrice(paperType, Number(quantity), option);
        const unitPrice = totalForQty > 0 && Number(quantity) > 0 ? totalForQty / Number(quantity) : 0;

        return {
            unitPrice: unitPrice,
            finalPrice: totalForQty
        };
    };

    const { unitPrice, finalPrice } = calculatePrice();
    const isCalculating = false;

    const timeMultiplier = printingTime === "express" ? 1.2 : 1.0;
    const adjustedTotal = finalPrice * jobs.length * timeMultiplier;

    // Actions
    const addJob = () => {
        const newId = `job-${Date.now()}`;
        setJobs([...jobs, { id: newId, name: '', file: null, preview: null, fileName: null, instructions: '', activeTags: [], externalLink: '', isOpen: true }]);
    };

    const removeJob = (id: string) => {
        if (jobs.length > 1) {
            setJobs(jobs.filter(j => j.id !== id));
        }
    };

    const toggleJobOpen = (id: string) => {
        setJobs(jobs.map(j => (j.id === id ? { ...j, isOpen: !j.isOpen } : j)));
    }

    const updateJob = (id: string, field: keyof Job, value: any) => {
        setJobs(jobs.map(j => (j.id === id ? { ...j, [field]: value } : j)));
    };

    const toggleTag = (id: string, tag: string) => {
        const job = jobs.find(j => j.id === id);
        if (!job) return;

        const newTags = job.activeTags.includes(tag)
            ? job.activeTags.filter(t => t !== tag)
            : [...job.activeTags, tag];

        updateJob(id, 'activeTags', newTags);
        // Also append to instructions for backend compatibility if needed
        const instructionsWithoutTags = job.instructions.split('\nTags:')[0];
        const newInstructions = newTags.length > 0
            ? `${instructionsWithoutTags}\nTags: ${newTags.join(', ')}`
            : instructionsWithoutTags;
        updateJob(id, 'instructions', newInstructions);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, jobId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            updateJob(jobId, 'file', file);
            updateJob(jobId, 'fileName', file.name);

            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    updateJob(jobId, 'preview', reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (file.type === "application/pdf") {
                updateJob(jobId, 'preview', null);
            }
        }
    };

    const nextStep = async () => {
        const isValid = await trigger();
        if (isValid) {
            setStep(2);
            // Disable body scroll when in full screen mode
            document.body.style.overflow = 'hidden';
        }
    };

    // Restore scroll when closing or unmounting
    useEffect(() => {
        if (step === 1) {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [step]);


    const handleSubmit = async () => {
        const emptyJobs = jobs.filter(j => !j.file && !j.externalLink && !j.preview);
        if (emptyJobs.length > 0) {
            toast.warning("Please upload designs for all jobs.");
            return;
        }

        setIsSubmitting(true);
        try {
            const promises = jobs.map(async (job) => {
                let designUrl = job.preview;
                if (job.file) {
                    designUrl = await uploadToCloudinary(job.file);
                }

                if (!designUrl && !job.externalLink) return null;

                // Combined instructions + tags for backend
                const fullInstructions = `[${job.activeTags.join(', ')}] ${job.instructions}`;

                return {
                    productId: productId || "custom",
                    productName: job.name || productName,
                    productImage: designUrl || undefined,
                    productCategory,
                    productSlug,
                    configuration: {
                        jobName: job.name,
                        jobInstructions: fullInstructions,
                        quantity,
                        paperType,
                        size,
                        format,
                        printingTime,
                        design_url: designUrl || undefined,
                        external_file_url: job.externalLink || undefined,
                        customWidth: watch("customWidth"),
                        customHeight: watch("customHeight"),
                    },
                    pricing: {
                        unitPrice: unitPrice * timeMultiplier,
                        subtotal: unitPrice * quantity * timeMultiplier,
                        packagingCost: 0,
                        finalPrice: adjustedTotal / jobs.length
                    },
                };
            });

            const payloads = (await Promise.all(promises)).filter(p => p !== null);

            if (isEditMode && editingItemId) {
                updateCartItem(editingItemId, payloads[0] as any);
                toast.success("Job updated!");
            } else {
                payloads.forEach(p => p && addToCart(p as any));
                toast.success(`${payloads.length} Jobs added to cart!`);
            }

            setStep(1);
            setJobs([{ id: `job-${Date.now()}`, name: '', file: null, preview: null, fileName: null, instructions: '', activeTags: [], externalLink: '', isOpen: true }]);

        } catch (error) {
            console.error(error);
            toast.error("Failed to process jobs");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px] flex flex-col">

            {/* ------------------------------------
               STEP 1: CONFIG VIEW (Premium Grid Layout)
               ------------------------------------ */}
            {step === 1 && (
                <div className="p-6 md:p-8 animate-in fade-in slide-in-from-left-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Configure Order</h2>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full"><LinkIcon className="h-4 w-4 text-gray-400" /></Button>
                    </div>

                    <div className="space-y-8">

                        {/* Shape & Size Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">Shape</Label>
                                <Select defaultValue="custom">
                                    <SelectTrigger className="h-12 bg-gray-50 border-gray-200 font-medium">
                                        <SelectValue placeholder="Shape" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="die-cut">Die Cut</SelectItem>
                                        <SelectItem value="circle">Circle</SelectItem>
                                        <SelectItem value="square">Square</SelectItem>
                                        <SelectItem value="custom">Custom Shape</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">Size</Label>
                                <Popover open={openSizeCombo} onOpenChange={setOpenSizeCombo}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openSizeCombo}
                                            className="w-full justify-between h-12 bg-gray-50 border-gray-200 font-medium"
                                        >
                                            {size ? SIZES.find((s) => s.value === size)?.label || "Custom Size" : "Select Size..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[280px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search size..." />
                                            <CommandList>
                                                <CommandEmpty>No size found.</CommandEmpty>
                                                <CommandGroup>
                                                    {SIZES.map((s) => (
                                                        <CommandItem
                                                            key={s.value}
                                                            value={s.value}
                                                            onSelect={(currentValue) => {
                                                                setValue("size", s.value === currentValue ? "" : s.value);
                                                                setOpenSizeCombo(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", size === s.value ? "opacity-100" : "opacity-0")} />
                                                            {s.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {size === "custom" && (
                            <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-in slide-in-from-top-2">
                                <div>
                                    <Label className="text-xs text-blue-800 font-bold mb-1 block">Width (mm)</Label>
                                    <Input type="number" {...register("customWidth", { valueAsNumber: true })} className="bg-white" />
                                </div>
                                <div>
                                    <Label className="text-xs text-blue-800 font-bold mb-1 block">Height (mm)</Label>
                                    <Input type="number" {...register("customHeight", { valueAsNumber: true })} className="bg-white" />
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Quantity</Label>
                                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Save 15% more at 500pcs</span>
                            </div>
                            <Select value={String(quantity)} onValueChange={(v) => setValue("quantity", Number(v))}>
                                <SelectTrigger className="h-12 bg-gray-50 border-gray-200 font-medium"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {[25, 50, 100, 250, 500, 1000, 2500, 5000].map(q => (
                                        <SelectItem key={q} value={String(q)}>{q} pcs</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Material Grid (Combined) */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Select Material</Label>
                                <Button variant="link" className="h-auto p-0 text-xs text-blue-600 font-bold">Need help choosing?</Button>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[...STANDARD_MATERIALS, ...PREMIUM_MATERIALS].map((mat) => (
                                    <div
                                        key={mat.id}
                                        className={cn(
                                            "border rounded-xl p-0 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all relative overflow-hidden group flex flex-col items-center text-center",
                                            paperType === mat.id ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30" : "border-gray-200 bg-white"
                                        )}
                                        onClick={() => setValue("paperType", mat.id)}
                                    >
                                        <div className="h-20 w-full p-2 flex items-center justify-center">
                                            {/* Simulate the 'Product Look' in the reference */}
                                            <div className="w-12 h-16 bg-white shadow-sm border border-gray-100 rounded-sm relative overflow-hidden">
                                                <img src={mat.img} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="w-full py-2 px-1 border-t border-gray-100 bg-gray-50/50 group-hover:bg-white transition-colors">
                                            <p className={cn("text-[10px] font-bold leading-tight", paperType === mat.id ? "text-blue-700" : "text-gray-700")}>{mat.name}</p>
                                        </div>

                                        {paperType === mat.id && (
                                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Price Bar */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{isCalculating ? "..." : formatPrice(finalPrice)}</span>
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Save 20%</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Total Price (GST Inclusive) • <span className="font-medium text-gray-600">{formatPrice(unitPrice)} / each</span></p>
                            </div>
                        </div>

                        <Button onClick={nextStep} className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14 rounded-xl text-lg font-bold shadow-blue-200 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                            <Upload className="h-5 w-5" /> Upload Artwork & Order
                        </Button>
                        <p className="text-center text-[10px] text-gray-400 mt-3">Free verification included with every order</p>
                    </div>
                </div>
            )}


            {/* ------------------------------------
               STEP 2: UPLOAD VIEW (Grid Layout)
               ------------------------------------ */}
            {step === 2 && (
                <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10 duration-500">

                    {/* Top Specs Bar (Blue Strip) */}
                    <div className="bg-blue-50/50 border-b border-blue-100 px-4 md:px-8 py-3 flex flex-wrap gap-4 items-center justify-between shadow-sm relative z-20">
                        <div className="flex flex-wrap items-center gap-0 text-sm divide-x divide-blue-200/50">
                            <div className="px-4 first:pl-0">
                                <span className="text-blue-400 text-[10px] uppercase font-bold block mb-0.5">Size</span>
                                <span className="font-bold text-slate-800 text-xs">{size === 'custom' ? 'Custom' : SIZES.find(s => s.value === size)?.label}</span>
                            </div>
                            <div className="px-4">
                                <span className="text-blue-400 text-[10px] uppercase font-bold block mb-0.5">Material</span>
                                <span className="font-bold text-slate-800 text-xs">{[...STANDARD_MATERIALS, ...PREMIUM_MATERIALS].find(m => m.id === paperType)?.name}</span>
                            </div>
                            <div className="px-4">
                                <span className="text-blue-400 text-[10px] uppercase font-bold block mb-0.5">Format</span>
                                <span className="font-bold text-slate-800 text-xs">{FORMATS.find(f => f.value === format)?.label}</span>
                            </div>
                            <div className="px-4">
                                <span className="text-blue-400 text-[10px] uppercase font-bold block mb-0.5">Speed</span>
                                <span className={cn("font-bold text-xs", printingTime === 'express' ? "text-amber-600" : "text-slate-800")}>
                                    {printingTime === 'express' ? '⚡ Express' : 'Standard'}
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={() => setStep(1)} className="bg-white border border-blue-100 text-blue-600 hover:bg-blue-50 h-8 text-xs font-bold rounded-lg shadow-sm">
                            <Edit2 className="h-3 w-3 mr-1.5" /> Edit Specs
                        </Button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-6">

                            {/* Guidelines Banner */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/50 p-2 rounded-lg border border-gray-100 w-fit mb-2 mx-auto md:mx-0">
                                <Info className="h-4 w-4 text-blue-500" />
                                <span>Artwork Guidelines: Acceptable formats: PDF, AI, JPG, PNG. Max 150MB per file.</span>
                                <span className="text-blue-500 font-bold cursor-pointer hover:underline">View full guidelines</span>
                            </div>

                            {/* Job Cards GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                                {jobs.map((job, index) => (
                                    <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">

                                        {/* Job Header */}
                                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-900 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold shadow-sm text-sm">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900">Job {index + 1 < 10 ? `0${index + 1}` : index + 1}</h3>
                                                    <p className={cn("text-[10px] font-bold flex items-center gap-1 uppercase", job.file ? "text-green-500" : "text-amber-500")}>
                                                        {job.file ? <><Check className="h-3 w-3" /> READY</> : "● AWAITING FILE"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {jobs.length > 1 && (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); removeJob(job.id); }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Job Body (Expanded by Default in Grid) */}
                                        <div className="p-5 flex-1 flex flex-col gap-5 bg-gray-50/30">

                                            {/* Job Name Input */}
                                            <div>
                                                <Label className="text-[10px] font-bold uppercase text-gray-400 mb-1.5 block tracking-wider">Job Name</Label>
                                                <Input
                                                    value={job.name}
                                                    onChange={(e) => updateJob(job.id, 'name', e.target.value)}
                                                    placeholder="e.g. Summer Campaign Stickers"
                                                    className="h-10 bg-white border-gray-200 text-sm font-medium focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm"
                                                />
                                            </div>

                                            {/* Upload Area */}
                                            <div className="flex-1 flex flex-col gap-3">
                                                {job.file ? (
                                                    <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm flex items-start gap-3 animate-in fade-in zoom-in-95 h-full relative group">
                                                        {/* Re-upload overlay */}
                                                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 z-10 pointer-events-none">
                                                        </div>

                                                        <div className="bg-green-50 text-green-600 h-10 w-10 flex items-center justify-center rounded-lg font-bold text-xs shrink-0">{job.fileName?.split('.').pop()?.toUpperCase() || "FILE"}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-sm truncate">{job.fileName}</p>
                                                                    <p className="text-[10px] text-gray-500">12.4 MB • Uploaded</p>
                                                                </div>
                                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-red-500" onClick={() => updateJob(job.id, 'file', null)}>
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <div className="w-full bg-gray-100 h-1 mt-3 rounded-full overflow-hidden">
                                                                <div className="bg-green-500 h-full w-full"></div>
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-green-600">
                                                                <Check className="h-3 w-3" /> VERIFIED
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {/* Upload Box */}
                                                        <div className="bg-gradient-to-br from-[#FDFBF7] to-[#F4F1E8] border-2 border-dashed border-[#DEDBD0] rounded-xl h-40 flex flex-col items-center justify-center text-center relative hover:border-blue-300 hover:bg-blue-50/10 transition-all group cursor-pointer">
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                onChange={(e) => handleFileChange(e, job.id)}
                                                                accept=".jpg,.jpeg,.png,.pdf,.ai,.eps,.psd"
                                                            />
                                                            <div className="bg-white p-2.5 rounded-xl shadow-sm mb-2 border border-white/50 group-hover:shadow-md transition-shadow group-hover:scale-110 duration-300">
                                                                <Upload className="h-5 w-5 text-blue-500" />
                                                            </div>
                                                            <p className="font-bold text-slate-800 text-sm mb-0.5">Drag & drop artwork</p>
                                                            <p className="text-slate-500 text-xs mb-2">or <span className="text-blue-600 font-bold hover:underline">browse files</span></p>
                                                        </div>

                                                        {/* URL Input */}
                                                        <div>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
                                                                </div>
                                                                <Input
                                                                    placeholder="Or paste file URL (Dropbox, Drive...)"
                                                                    className="pl-9 h-9 bg-white border-gray-200 text-xs focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm"
                                                                    value={job.externalLink}
                                                                    onChange={(e) => updateJob(job.id, 'externalLink', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Special Instructions Tags */}
                                            <div>
                                                <Label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block tracking-wider">Options</Label>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {INSTRUCTION_TAGS.slice(0, 3).map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => toggleTag(job.id, tag)}
                                                            className={cn(
                                                                "h-6 px-2.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 border",
                                                                job.activeTags.includes(tag)
                                                                    ? "bg-slate-800 text-white border-slate-800"
                                                                    : "bg-white text-slate-600 border-gray-200 hover:border-gray-300"
                                                            )}
                                                        >
                                                            {job.activeTags.includes(tag) && <Check className="h-2.5 w-2.5" />}
                                                            {tag}
                                                        </button>
                                                    ))}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className="h-6 px-2 rounded-md text-[10px] font-bold bg-white border border-gray-200 text-slate-500 hover:bg-gray-50 flex items-center gap-1">
                                                                <Plus className="h-2.5 w-2.5" /> More
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-56 p-2">
                                                            <div className="space-y-1">
                                                                {INSTRUCTION_TAGS.slice(3).map(tag => (
                                                                    <div
                                                                        key={tag}
                                                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer text-xs font-medium"
                                                                        onClick={() => toggleTag(job.id, tag)}
                                                                    >
                                                                        <div className={cn("h-4 w-4 border rounded flex items-center justify-center", job.activeTags.includes(tag) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300")}>
                                                                            {job.activeTags.includes(tag) && <Check className="h-3 w-3" />}
                                                                        </div>
                                                                        {tag}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <Textarea
                                                    value={job.instructions}
                                                    onChange={(e) => updateJob(job.id, 'instructions', e.target.value)}
                                                    placeholder="Notes..."
                                                    className="bg-white border-gray-200 text-xs min-h-[50px] resize-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                ))}

                                {/* ADD NEW JOB BUTTON (Card Style) */}
                                <div
                                    onClick={addJob}
                                    className="bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/30 hover:border-blue-400 hover:shadow-md transition-all group min-h-[400px]"
                                >
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 group-hover:text-blue-600">Add Another Job</h3>
                                    <p className="text-sm text-gray-400 font-medium px-8 mt-2">Configure multiple designs with the same specs</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="bg-white border-t border-gray-200 p-4 md:p-6 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-50">
                        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-6 md:gap-12">
                                <div className="hidden md:block">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pricing Breakdown</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                        <span>Unit: {formatPrice(unitPrice)}</span>
                                        <span className="h-3 w-px bg-gray-300"></span>
                                        <span>Setup: {formatPrice(0)}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Payable</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{formatPrice(adjustedTotal)}</p>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{jobs.length} Jobs</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#0099FF] hover:bg-[#0077CC] text-white h-14 px-10 rounded-xl text-lg font-bold shadow-xl shadow-blue-200 transition-all active:scale-95">
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Proceed to Payment"} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
