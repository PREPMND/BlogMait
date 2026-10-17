'use client'
import { Search, Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { UserMenu } from "../auth/user-menu"
import ThemeToggle from "@/store/theme-toggle"
import { useState } from "react"

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)

    const navItems = [
        { label: 'Home', href: "/" },
        { label: 'Create', href: "/post/create" },
        { label: 'Profile', href: "/profile" },
    ]
    const { data: session, isPending } = useSession()
    const router = useRouter()

    return (
        <>
            <div className="w-full select-none px-3 sm:px-4 pt-2 z-50 rounded-b-md bg-white dark:bg-neutral-900 pb-2 shadow-sm shadow-olive-700 dark:shadow-neutral-400 border-b border-transparent dark:border-neutral-800 sticky top-0 mb-2 md:w-[95%] mx-auto h-14 md:h-18 flex justify-between items-center transition-colors duration-200 overflow-hidden">
                <button
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors shrink-0"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <nav className="hidden md:flex items-center gap-6 text-gray-700 dark:text-neutral-300">
                    {navItems.map((item) => (
                        <Link
                            className="border-b-2 border-r-2 hover:scale-[1.02] border-gray-200 dark:border-neutral-800 text-[16px] md:text-[18px] hover:border-gray-400 dark:hover:border-neutral-500 transition-all duration-300 py-1 px-2 rounded-md"
                            key={item.label}
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <input
                            className="w-28 sm:w-36 md:w-44 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search..."
                        />
                        <Search className="hidden md:flex w-5 h-5 text-gray-500 dark:text-neutral-400" />
                        <ThemeToggle classStyle="hidden sm:flex" />
                    </div>
                    {isPending ? (
                        <div className="border rounded-full h-8 w-8 shrink-0" />
                    ) : session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <Button
                            onClick={() => router.push('/auth')}
                            className="text-sm md:text-base px-3 shrink-0"
                            variant="destructive"
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-white dark:bg-neutral-900 border-b border-border shadow-lg">
                    <nav className="flex flex-col p-4 gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex items-center gap-3 px-4 py-3">
                            <ThemeToggle classStyle="flex sm:hidden" />
                        </div>
                    </nav>
                </div>
            )}
        </>
    )
}
