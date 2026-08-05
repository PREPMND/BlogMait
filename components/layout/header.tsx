import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface containerProps{
    children: ReactNode;
    className?:string;
}
export default function Container({children,className}: containerProps)
{
    return (
        <div className={cn()}>
            <div>

            </div>
        </div>
    )
}