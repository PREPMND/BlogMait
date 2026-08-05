'use-client'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from "../layout/header"
export function ThemeProvider({
    children,
    ...props
}:ExtendedThemeProviderProps){
    return (
        <NextThemesProvider {...props}>
            <Header/>
            <main className={cn("",classN)}>
                {children}
            </main>
        </NextThemesProvider>
    )
}