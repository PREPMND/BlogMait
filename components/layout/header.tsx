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
        <div className="w-full sticky top-1 md:w-[90%] mx-auto h-16 flex justify-center items-center">
            <div className="flex items-center w-full " >
                <nav className="flex justify-evenly items-center gap-4 w-full text-[14px] md:text-[18px]  text-gray-700">
                    {
                        navItems.map((item) => (
                            <Link className={`${item.label=='Con'}`} key={item.label} href={item.href}>
                                {item.label}
                            </Link>
                        ))
                    }
                </nav>
            </div>
        </div>
    )
}
