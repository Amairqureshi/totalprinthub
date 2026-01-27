"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Package, FileText, User, Mail, Phone, ArrowRight, CloudUpload } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/config/navigation";
import { supabase } from "@/lib/supabase/client";

// Get flat list of products for dropdown
const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap(cat =>
    cat.items.map(item => item.title)
);

const quoteSchema = z.object({
    type: z.enum(["existing", "custom"]),
    productName: z.string().optional(),
    quantity: z.string().min(1, "Quantity is required"),
    size: z.string().optional(),
    material: z.string().optional(),
    lamination: z.string().optional(),
    details: z.string().optional(),
    fileUrl: z.string().optional(),

    // Contact Info
    quoteTitle: z.string().min(1, "Quote Title is required"),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email"),
    whatsapp: z.string().min(10, "Valid Whatsapp required"),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function CustomQuotePage() {
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            type: "existing",
            quantity: "100",
            lamination: "None",
            material: "",
            size: ""
        }
    });

    const quoteType = watch("type");
    const fileUrl = watch("fileUrl");

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setValue("email", user.email || "");
                // Split name if possible
                const parts = (user.user_metadata?.full_name || "").split(" ");
                if (parts.length > 0) setValue("firstName", parts[0]);
                if (parts.length > 1) setValue("lastName", parts.slice(1).join(" "));
            }
        };
        loadUser();
    }, [setValue]);

    const onSubmit = async (data: QuoteFormData) => {
        try {
            const fullProductName = data.type === 'existing' ? data.productName : data.productName; // In UI: Dropdown vs Input

            const payload = {
                user_id: user?.id || null,
                type: data.type,
                product_name: fullProductName || "Custom Request",
                contact_name: `${data.firstName} ${data.lastName}`,
                contact_email: data.email,
                contact_phone: data.whatsapp,
                title: data.quoteTitle,
                quantity: data.quantity,
                material: data.material,
                size: data.size,
                finish: data.lamination,
                description: data.details,
                file_url: data.fileUrl,
                status: 'pending'
            };

            const { error } = await supabase.from('quotes').insert(payload);
            if (error) throw error;

            toast.success("Quote Request Sent Successfully!");
            reset();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to submit request.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const filePath = `quotes/${Date.now()}.${fileExt}`;

            const { error } = await supabase.storage.from('uploads').upload(filePath, file);
            if (error) throw error;

            const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
            setValue("fileUrl", data.publicUrl);
            toast.success("File uploaded!");
        } catch (error: any) {
            console.error(error);
            toast.error("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                        <span>Home</span>
                        <span className="mx-2">/</span>
                        <span className="font-semibold text-slate-900">Request Quote</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Request Custom Quote</h1>
                    <p className="text-slate-500 mt-1">Fill out the details below and our team will get back to you with a competitive bulk pricing quote.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Product Specs */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">

                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <Package className="h-6 w-6 text-green-700" />
                            <h2 className="text-lg font-bold text-slate-900">Product Specifications</h2>
                        </div>

                        {/* Product Type Toggle */}
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-medium text-slate-700 w-24">Product Type</span>
                            <RadioGroup
                                defaultValue="existing"
                                value={quoteType}
                                onValueChange={(v) => setValue("type", v as "existing" | "custom")}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="existing" id="type-existing" className="text-blue-600" />
                                    <Label htmlFor="type-existing" className="font-normal cursor-pointer">Existing</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="custom" id="type-custom" className="text-blue-600" />
                                    <Label htmlFor="type-custom" className="font-normal cursor-pointer">Custom</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Product Name / Select */}
                        <div className="space-y-2">
                            <Label className="text-slate-700">
                                {quoteType === "existing" ? "Select Product" : "Product Name"} <span className="text-red-500">*</span>
                            </Label>
                            {quoteType === "existing" ? (
                                <Select onValueChange={(v) => setValue("productName", v)}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200">
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_PRODUCTS.map((p, i) => (
                                            <SelectItem key={i} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    placeholder="e.g. Glossy Die-Cut Stickers"
                                    className="bg-white border-slate-200"
                                    {...register("productName")}
                                />
                            )}
                        </div>

                        {/* Grid Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Quantity <span className="text-red-500">*</span></Label>
                                <div className="flex">
                                    <button
                                        type="button"
                                        className="px-3 border border-r-0 rounded-l-md bg-slate-50 text-slate-500 hover:bg-slate-100"
                                        onClick={() => {
                                            const current = parseInt(watch("quantity")) || 0;
                                            setValue("quantity", String(Math.max(1, current - 50)));
                                        }}
                                    >
                                        -
                                    </button>
                                    <Input
                                        className="rounded-none text-center bg-white border-slate-200"
                                        {...register("quantity")}
                                        type="number"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 border border-l-0 rounded-r-md bg-slate-50 text-slate-500 hover:bg-slate-100"
                                        onClick={() => {
                                            const current = parseInt(watch("quantity")) || 0;
                                            setValue("quantity", String(current + 50));
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Category <span className="text-red-500">*</span></Label>
                                <Select>
                                    <SelectTrigger className="bg-slate-50 border-slate-200">
                                        <SelectValue placeholder="Stickers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="stickers">Stickers</SelectItem>
                                        <SelectItem value="labels">Labels</SelectItem>
                                        <SelectItem value="cards">Cards</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700">Size</Label>
                                <Input placeholder="e.g. 3 x 3 inches" className="bg-white border-slate-200" {...register("size")} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Material</Label>
                                <Input placeholder="e.g. Vinyl, Kraft Paper" className="bg-white border-slate-200" {...register("material")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Lamination</Label>
                            <Select onValueChange={(v) => setValue("lamination", v)} defaultValue="None">
                                <SelectTrigger className="bg-white border-slate-200">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="Gloss">Gloss</SelectItem>
                                    <SelectItem value="Matte">Matte</SelectItem>
                                    <SelectItem value="Holographic">Holographic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Details</Label>
                            <Textarea
                                placeholder="Additional requirements like rounded corners, special packaging..."
                                className="min-h-[100px] bg-white border-slate-200"
                                {...register("details")}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-slate-700">Artwork</Label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
                                {!fileUrl ? (
                                    <>
                                        <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                                            <CloudUpload className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">
                                            Drag and drop your file here OR <span className="text-blue-600">Browse Files</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">PDF, AI, PSD, PNG or JPEG (Max 50MB)</p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-green-600 mb-2">File Uploaded Successfully!</p>
                                        <p className="text-xs text-slate-500 truncate max-w-xs">{fileUrl.split('/').pop()}</p>
                                        <button type="button" onClick={() => setValue("fileUrl", "")} className="text-xs text-red-500 underline mt-2">Remove</button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 h-fit space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <User className="h-6 w-6 text-green-700" />
                            <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase">Quote Title <span className="text-red-500">*</span></Label>
                                <Input placeholder="e.g. Marketing Campaign Stickers" className="bg-white" {...register("quoteTitle")} />
                                {errors.quoteTitle && <p className="text-red-500 text-xs">{errors.quoteTitle.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">First Name <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Amair" className="bg-white" {...register("firstName")} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">Last Name <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Qureshi" className="bg-white" {...register("lastName")} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase">Email Address <span className="text-red-500">*</span></Label>
                                <Input placeholder="amairdesigner@gmail.com" className="bg-white" {...register("email")} />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase">Whatsapp Number <span className="text-red-500">*</span></Label>
                                <div className="flex items-center border border-slate-200 rounded-md bg-white px-3">
                                    <span className="mr-2 text-lg">🇮🇳</span>
                                    <Input
                                        placeholder="+91 093980 12432"
                                        className="border-none shadow-none focus-visible:ring-0 px-0"
                                        {...register("whatsapp")}
                                    />
                                </div>
                                {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message}</p>}
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 text-lg shadow-lg shadow-blue-200" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : (
                                    <>
                                        Send Quote Request <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                                Typical Response Time: &lt; 24 Hours
                            </p>
                        </div>

                        {/* Help Box */}
                        <div className="mt-8 bg-slate-100 rounded-xl p-6">
                            <h3 className="font-bold text-slate-800 text-sm mb-2">Need Help?</h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                If you have a complex project or special requirements not listed here, feel free to chat with our consultants.
                            </p>
                            <button type="button" className="text-xs font-bold text-green-700 flex items-center hover:underline">
                                <span className="mr-2">💬</span> Live Chat Support
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
