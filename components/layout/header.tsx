import Link from "next/link"



export default function Header()
{
    const navItems=[
        {
            label:'Home' , href:"/" 
        },
        {
            label:'About' , href:"/about" 
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

            </nav>
            </div>
        </div>
    )
}
