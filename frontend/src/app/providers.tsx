'use client';

import { ApiProvider } from "@/api/context";
import { SessionProvider } from 'next-auth/react';
import { Amplify } from 'aws-amplify';
import awsconfig from '../api/aws-exports';
Amplify.configure(awsconfig)

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ApiProvider>
                {children}
            </ApiProvider>
        </SessionProvider>
    );
};