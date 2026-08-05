'use-client'
import {}
export function ThemeProvider({
    children,
    ...props
}:ExtendedThemeProviderProps){
    return (
        <NextThemesProvider {...props}>

        </NextThemesProvider>
    )
}