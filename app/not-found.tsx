import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <Button asChild>
                <a href="/">Go back home</a>
            </Button>
        </div>
    )
}

