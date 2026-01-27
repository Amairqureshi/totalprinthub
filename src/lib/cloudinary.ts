
export const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"; // Fallback to a common default if not set

    if (!cloudName) {
        throw new Error("Cloudinary Cloud Name is missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local");
    }

    const fileName = file.name.toLowerCase();
    // Only force 'raw' for strictly non-standard image files. Let PDF use 'auto' (usually becomes 'image' which works).
    const isDoc = fileName.endsWith('.ai') || fileName.endsWith('.psd') || fileName.endsWith('.eps');
    const resourceType = isDoc ? "raw" : "auto";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    // Use 'raw' for documents to ensure they are stored as-is without image conversion
    formData.append("resource_type", resourceType);
    // formData.append("folder", "totalprinthub_orders");

    try {
        console.log(`[Cloudinary] Starting upload: ${fileName}, Type: ${resourceType}, Mode: Public`);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json();
            const msg = errorData.error?.message || "Upload failed";
            throw new Error(`Cloudinary Error: ${msg} (Preset: ${uploadPreset}, Cloud: ${cloudName})`);
        }

        const data = await res.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};
