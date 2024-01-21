'use client';

import Spinner from 'react-activity/dist/Spinner';
import 'react-activity/dist/Spinner.css';

import { useAuth } from "@/lib/firebase/AuthContext";
import { useRouter } from 'next/navigation';

export default function Protected({ children }: { children: Readonly<React.ReactNode> }) {
    const { currentUser, hasCheckedAuth } = useAuth();
    const router = useRouter();

    if (!hasCheckedAuth) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return currentUser ? children : router.push('/login');
};