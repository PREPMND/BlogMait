import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

export default function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <Button asChild>
                <Link href="/">Go back home</Link>
            </Button>
        </div>
    )
}

