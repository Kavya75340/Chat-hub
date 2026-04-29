import {
    FileText,
    Download,
    Image as ImageIcon,
    Video,
    File,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function FilePreview({ kind, name, size, onMe }) {
    if (kind === "image") {
        return (
            <div className="overflow-hidden rounded-xl border border-border bg-secondary">
                <div className="relative h-48 w-72 bg-gradient-to-br from-secondary via-card to-accent">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon
                            className="h-8 w-8 text-muted-2"
                            strokeWidth={1.25}
                        />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/40 to-transparent px-3 py-2">
                        <span className="truncate text-[11px] font-medium text-white">
                            {name}
                        </span>

                        <button className="rounded-md p-1 text-white/90 hover:bg-white/10">
                            <Download className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const Icon = kind === "pdf" ? FileText : kind === "video" ? Video : File;

    return (
        <div
            className={cn(
                "flex w-72 items-center gap-3 rounded-xl border p-3",

                onMe ? "border-white/10 bg-white/5" : "border-border bg-card"
            )}
        >
            <div
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",

                    onMe
                        ? "bg-white/10 text-white"
                        : "bg-secondary text-foreground"
                )}
            >
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <div
                    className={cn(
                        "truncate text-[13px] font-medium",

                        onMe ? "text-white" : "text-foreground"
                    )}
                >
                    {name}
                </div>

                <div
                    className={cn(
                        "text-[11px]",

                        onMe ? "text-white/60" : "text-muted-foreground"
                    )}
                >
                    {kind.toUpperCase()}
                    {size ? ` · ${size}` : ""}
                </div>
            </div>

            <button
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",

                    onMe
                        ? "text-white/80 hover:bg-white/10"
                        : "text-muted-foreground hover:bg-hover-bg hover:text-foreground"
                )}
            >
                <Download className="h-4 w-4" />
            </button>
        </div>
    );
}
