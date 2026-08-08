import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ThemeToggle from "@/store/theme-toggle"
import { User } from "better-auth";
import { LogOut, PenBox, User2Icon } from "lucide-react"
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface UserMenuProps {
    user: User;
}

export function UserMenu({ user }: UserMenuProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast('You have been logged out successfully');
                        router.refresh()// soft refresh
                    }
                }
            })

        } catch (e) {
            console.log(e);
            toast('Failed to log-out')
        }
    }

    return (
        <>
            <DropdownMenu >
                <DropdownMenuTrigger className="rounded w-14 h-14">
                    <Avatar>
                        <AvatarImage
                            src={user?.image ?? undefined}
                            alt={user?.name || "User avatar"}
                        />
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-56 pb-4`}>
                    <div className="flex items-center justify-between gap-4 p-2 mr-6">
                        <div className="flex flex-col space-y-1 loading-none">
                            <p className="font-bold">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <ThemeToggle classStyle={`flex smm:hidden`} />

                    </div>

                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem className={'gap-4'}>
                        <Link className="flex items-center w-full justify-start gap-7" href={'/profile'}>
                            <User2Icon />
                            <span>Profile</span>
                        </Link>


                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                        <span>ToggleTheme</span>
                        <ThemeToggle/>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem onClick={handleLogout} className={'flex items-center gap-7'}>
                        <LogOut />
                        <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>


            </DropdownMenu>
        </>
    )
}