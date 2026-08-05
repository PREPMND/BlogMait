
export default function Header({children,className}: containerProps)
{
    return (
        <div className={cn("container mx-auto px-4", className)}>
            <div>
                {children}
            </div>
        </div>
    )
}
