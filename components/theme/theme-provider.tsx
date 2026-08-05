'use-client'
import { ThemeProvider as NextThemesProvider } from "next-themes"
export function ThemeProvider({
    children,
    ...props
}:ExtendedThemeProviderProps){
    return (
        <NextThemesProvider {...props}>
            <Header/>
            <main>
                {}
            </main>
        </NextThemesProvider>
    )
}