'use-client'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from "../layout/header"
export function ThemeProvider({
    children,
    containerClassName,
    ...props
}:ExtendedThemeProviderProps){
    return (
        <NextThemesProvider {...props}>
            <Header/>
            <main className={cn("",ContainerClassName)}>
                {children}
            </main>
        </NextThemesProvider>
    )
}