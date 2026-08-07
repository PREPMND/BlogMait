'use-client'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import Header from "../layout/header"
import { cn } from "@/lib/utils"
import { Footer } from "../layout/footer";

interface ExtendedThemeProviderProps extends ThemeProviderProps{
    containerClassName?:string;
}
//gp to shadcn next js theme
export function ThemeProvider({
    children,
    containerClassName,
    ...props
}:ExtendedThemeProviderProps){
    return (
        <NextThemesProvider {...props}>
            <Header/>
            <main className={cn(" mx-auto flex flex-col",containerClassName)}>
                {children}
            </main>
            <Footer />
        </NextThemesProvider>
    )
}