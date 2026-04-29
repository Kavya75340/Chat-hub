import { Phone, Video, Info } from "lucide-react";
import { Avatar } from "@/components/ui/UserAvatar";

export function ChatHeader({ chat }) {
    if (!chat) return null; // safety

    return (
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
                <Avatar
                    initials={chat?.name?.slice(0, 2) || "?"}
                    online={chat?.online}
                    size="md"
                />

                <div>
                    <div className="text-[14px] font-semibold">
                        {chat?.name}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                        {chat?.online ? "Active now" : "Offline"}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Phone className="h-4 w-4" />
                <Video className="h-4 w-4" />
                <Info className="h-4 w-4" />
            </div>
        </div>
    );
}
