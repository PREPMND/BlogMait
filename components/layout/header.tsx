'use client'
import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
export default function Header() {
    const navItems = [
        {
            label: 'Home', href: "/"
        },
        {
            label: 'Create', href: "/post/create"
        },
        {
            label: 'Contact', href: "/contact"
        }
    ]
    const router =useRouter();

    return (
        <div className="w-full select-none px-4 pt-2 z-50 rounded-b-md rounded-l-sm rounded-r-sm bg-white dark:bg-neutral-900 pb-2 shadow-sm shadow-olive-700 dark:shadow-neutral-400 border-b border-transparent dark:border-neutral-800 sticky top-0 mb-2  md:w-[95%] mx-auto h-18 flex justify-between items-center transition-colors duration-200">
            <div className="flex items-center h-full justify-self-start md:w-[50%]" >
                <nav className="flex items-center gap-8 justify-between w-[60%] text-gray-700 dark:text-neutral-300">
                    {
                        navItems.map((item) => (
                            <Link className={`${item.label == 'Contact' || item.label == 'Home' ? 'hidden md:flex' : 'flex'}
                    border-b-2 border-r-2 ho border-gray-200 dark:border-neutral-800
                    text-[16px] md:text-[20px] 
                    hover:border-gray-400 dark:hover:border-neutral-500 transition-all duration-300 py-1 md:py-1.5 px-2 md:px-2.5 rounded-md
                    `} key={item.label} href={item.href}>
                                {item.label}
                            </Link>
                        ))
                    }
                </nav>
            </div>
            <div className="flex justify-between items-center gap-2 md:gap-6">
                <div className="md:flex md:items-center md:gap-3">
                    <input className="min-w-[30%] border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search...">
                    </input>
                    <Search className="hidden md:flex text-gray-500 dark:text-neutral-400" />
                </div>
                <Button 
                onClick={() => router.push('/auth')}
                className="hidden text-[18px] md:text-[20px] md:px-3 md:block" variant="destructive">Login</Button>
            </div>
        </div>

    )
}
