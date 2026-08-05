import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <ThemeProvider attribute={'class'}  defaultTheme="white" enableSystem disableTransitionOnChange containerClassName=" md:w-[70%] w-[95%] border-l-1 border-r-1 min-h-[85vh] border-gray-300 rounded-md shadow-md shadow-gray-300 dark:shadow-gray-700 dark:border-gray-700">
          {children}
        </ThemeProvider>
      </body>

    </html>
  );
}
