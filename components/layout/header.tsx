import Link from "next/link"
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
        <div className="w-full sticky top-2  md:w-[90%] mx-auto h-18 flex justify-center items-center">
            <div className="flex items-center h-full w-full" >
                <Link className="text-3xl font-[500]  ml-2 mr-3" href="/">Logo</Link>
                <nav className="flex justify-evenly items-center gap-4 w-full text-[14px] md:text-[18px]  text-gray-700">
                    {
                        navItems.map((item) => (
                            <Link className={`${item.label=='Contact'?'hidden md:flex':'flex'}
                            border-b-2 border-r-2 border-gray-200 
                            
                            hover:border-gray-400 transition-all duration-300 py-1 px-2 text-[15px] rounded-md
                            `} key={item.label} href={item.href}>
                                {item.label}
                            </Link>
                        ))
                    }
                </nav>
            </div>
        </div>
    )
}
