'use client';

import Spinner from 'react-activity/dist/Spinner';
import 'react-activity/dist/Spinner.css';

import { useAuth } from "@/lib/firebase/AuthContext";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Protected({ children }: { children: Readonly<React.ReactNode> }) {
    const { currentUser, hasCheckedAuth } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!currentUser && hasCheckedAuth) {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [currentUser, hasCheckedAuth, router]);

    if (!hasCheckedAuth) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return currentUser ? children : null;
};