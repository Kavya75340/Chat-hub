import { Sparkles } from "lucide-react";
import { aiSuggestions } from "./mockData";

export function AISuggestions({ onPick }) {
    return (
        <div className="flex items-center gap-2 px-1">
            <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-foreground" />
                <span className="hidden sm:inline">Smart Assist</span>
            </div>
            <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {aiSuggestions.map((s, i) => (
                    <button
                        key={s}
                        onClick={() => onPick(s)}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="shrink-0 animate-[pop-in_0.3s_cubic-bezier(0.22,1,0.36,1)_both] rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground shadow-card transition-all hover:border-foreground/20 hover:bg-hover-bg"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
