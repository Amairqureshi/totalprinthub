import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    description?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendValue, description }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                    <Icon className="h-5 w-5 text-blue-600" />
                </div>
            </div>

            {(trend || description) && (
                <div className="mt-4 flex items-center gap-2">
                    {trend === 'up' && (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                            {trendValue}
                        </span>
                    )}
                    {trend === 'down' && (
                        <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                            {trendValue}
                        </span>
                    )}
                    {trend === 'neutral' && trendValue && (
                        <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-full">
                            <Minus className="mr-1 h-3 w-3" />
                            {trendValue}
                        </span>
                    )}
                    {description && (
                        <span className="text-xs text-slate-400 font-medium ml-1 truncate max-w-[150px]">{description}</span>
                    )}
                </div>
            )}
        </div>
    );
}
