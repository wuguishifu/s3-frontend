'use client'

import { AuthProvider } from "@/lib/firebase/AuthContext"
import { CredentialsProvider } from "@/lib/firebase/CredentialsContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <AWSProvider>
                {children}
            </AWSProvider>
        </AuthProvider>
    );
};