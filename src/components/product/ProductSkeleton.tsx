import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2 p-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
}
