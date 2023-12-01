'use client';

import { ApiProvider } from "@/api/context";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApiProvider>
            {children}
        </ApiProvider>
    );
};