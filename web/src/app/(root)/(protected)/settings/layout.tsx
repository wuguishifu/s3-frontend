'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const focusedLinkClass = 'font-bold opacity-100';
const unfocusedLinkClass = 'opacity-70';

export default function SettingsLayout({ children }: { children: Readonly<React.ReactNode> }) {
    const pathname = usePathname();

    return (
        <main className="h-full flex flex-col flex-1 pb-8">
            <h1>Settings</h1>
            <div className="flex flex-row flex-1 gap-4">
                <nav className="w-32">
                    <Link href="/settings/general">
                        <p className={pathname.startsWith('/settings/general') ? focusedLinkClass : unfocusedLinkClass}>General</p>
                    </Link>
                    <Link href="/settings/aws">
                        <p className={pathname.startsWith('/settings/aws') ? focusedLinkClass : unfocusedLinkClass}>AWS</p>
                    </Link>
                </nav>
                <div className="flex-1">
                    {children}
                </div>
                <div className="hidden xl:flex w-32" />
            </div>
        </main>
    );
};