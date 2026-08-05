import type { Metadata } from "next";
import { Geist, Geist_Mono ,Playfair_Display, Poppins, Quicksand} from "next/font/google";
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

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"], // Required if it's not a variable font
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Configure Quicksand (Sleek Rounded Terminals)
const quicksand = Quicksand({
  variable: "--font-quicksand",
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
      className={`${playfair.variable} ${poppins.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <ThemeProvider attribute={'class'}  defaultTheme="white" enableSystem disableTransitionOnChange containerClassName=" md:w-[70%]  w-[99%] border-l-1 border-r-1 min-h-[100vh] dark:bg-neutral-900 bg-white border-gray-300 rounded-md dark:border-neutral-500">
          {children}
        </ThemeProvider>
      </body>

    </html>
  );
}
