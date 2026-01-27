import { NextRequest, NextResponse } from "next/server";
import { S3 } from "aws-sdk";

/**
 * Generate presigned URL for direct S3 upload
 * This allows clients to upload files directly to S3 without going through the Next.js server
 */
export async function POST(request: NextRequest) {
    try {
        const { fileName, fileType } = await request.json();

        if (!fileName || !fileType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if AWS credentials are configured
        if (
            !process.env.AWS_ACCESS_KEY_ID ||
            !process.env.AWS_SECRET_ACCESS_KEY ||
            !process.env.AWS_S3_BUCKET_NAME
        ) {
            console.warn("AWS S3 not configured");
            return NextResponse.json(
                { error: "File upload not configured" },
                { status: 503 }
            );
        }

        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || "ap-south-1",
        });

        const key = `uploads/${Date.now()}-${fileName}`;

        const presignedUrl = await s3.getSignedUrlPromise("putObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
            Expires: 300, // 5 minutes
        });

        return NextResponse.json({
            uploadUrl: presignedUrl,
            key,
            fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`,
        });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
