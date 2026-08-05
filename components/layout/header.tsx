import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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


    return (
        <div className="w-full sticky top-2  md:w-[95%] mx-auto h-18 flex justify-between items-center">
            <div className="flex items-center h-full justify-self-start md:w-[60%]" >
                <nav className="flex justify-evenly items-center gap-4 w-full text-gray-700">
                    {
                        navItems.map((item) => (
                            <Link className={`${item.label=='Contact' || item.label=='Home'?'hidden md:flex':'flex'}
                            border-b-2 border-r-2 border-gray-200 
                             text-[16px] md:text-[20px] 
                            hover:border-gray-400 transition-all duration-300 py-1 md:py-1.5 px-2 md:px-2.5 rounded-md
                            `} key={item.label} href={item.href}>
                                {item.label}
                            </Link>
                        ))
                    }
                </nav>
            </div>
            <div className="flex justify-between items-center gap-2 md:gap-6">
                <div className="hidden  md:flex md:items-center md:gap-3">
                    <input className="min-w-[30%] border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search...">
                    </input>
                    <Search/>
                    
                </div>
                <Button className="hidden text-[18px] md:text-[20px] md:px-3 md:block" variant="destructive">Login</Button>
            </div>
        </div>
    )
}
