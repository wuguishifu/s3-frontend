// must be in this order, defaults overrides globals
import "./globals.css";

import "./defaults.css";

import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Bucket Store",
    description: "Created by Bo Bramer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Providers>
            <html lang="en">
                <body className={cn(nunito.className, 'h-screen flex flex-col bg-primary-foreground')}>
                    <Toaster richColors />
                    {children}
                </body>
            </html>
        </Providers>
    );
};