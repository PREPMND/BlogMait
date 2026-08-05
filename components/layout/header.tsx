import { cn } from "@/lib/utils";
import { ReactNode } from "react";
//cn merges enerything in class
interface containerProps{
    children: ReactNode;
    className?:string;
}
export default function Container({children,className}: containerProps)
{
    return (
        <div className={cn("container mx-auto px-4", className)}>
            <div>

            </div>
        </div>
    )
}