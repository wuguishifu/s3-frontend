'use client'

import { AuthProvider } from "@/lib/firebase/AuthContext"
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};