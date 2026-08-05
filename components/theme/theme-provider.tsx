'use-client'
import { ThemeProvider as NextTheme } from "next-themes"
export function ThemeProvider({
    children,
    ...props
}:ExtendedThemeProviderProps){
    return (
        <NextThemesProvider {...props}>

        </NextThemesProvider>
    )
}