import { Search, MoreHorizontal, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/UserAvatar";
import { updateUserStatus } from "@/api/userApi";
import { useNavigate } from "react-router-dom";

export function TopBar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        if (user) {
            await updateUserStatus(user.userId, false);
        }

        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                    <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight text-foreground">
                    ChatHub
                </span>
                <span className="ml-2 hidden sm:inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    BETA
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hover-bg hover:text-foreground">
                    <Search className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-hover-bg hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
                <div className="ml-1">
                    <Avatar
                        initials={user?.name?.slice(0, 2)}
                        size="sm"
                        online={user?.status === "ONLINE"}
                    />
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
