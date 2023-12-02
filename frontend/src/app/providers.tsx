'use client';

import { KeystoreProvider } from "@/api/keystore";

export default function ProviderTree({ children }: { children: React.ReactNode }) {
    return (
        <KeystoreProvider>
            {children}
        </KeystoreProvider>
    );
};