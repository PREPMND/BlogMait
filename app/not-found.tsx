import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

export default function NotFound() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans  dark:bg-black">
            <h1>404 - Page Not Found</h1>
            <Button asChild>
                <Link href="/">Go back home</Link>
            </Button>
        </div>
    )
}

