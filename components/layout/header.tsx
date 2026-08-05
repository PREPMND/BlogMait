import Link from "next/link"



export default function Header()
{
    const navItems=[
        {
            label:'Home' , href:"/" 
        },
        {
            label:'Create' , href:"/post/create" 
        },
        {
            label:'Contact' , href:"/contact"
        }
    ]


    return (
        <div className="w-full sticky top-1 md:w-[90%] mx-auto h-16 flex justify-center items-center">
            <div className="flex items-center gap-6" >
            <Link href="/" > Go to HomePage </Link>
            <nav className="flex gap-6">
                {
                    navItems.map((item,index)=>(
                        <Link key={item.label} href={item.href}>
                            {item.label}
                        </Link>
                    ))
                }
            </nav>
            </div>
        </div>
    )
}
