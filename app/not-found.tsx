import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";
import {Loading}
export default function NotFound() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans h-full gap-4 dark:bg-black">
            <h1>404 - Page Not Found</h1>
            <Button className={`text-[13px] md:text-[16px]`} render={<Link href="/" />}>
                <Link href="/">Go back home</Link>
            </Button>
        </div>
    )
}

