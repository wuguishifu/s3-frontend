'use client';

import SettingsNavbar from "@/app/(root)/(protected)/settings/settings-navbar";

export default function SettingsLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <main className="h-full flex flex-col flex-1 pb-8">
            <div className="flex flex-row flex-1 gap-4">
                <SettingsNavbar />
                <div className="flex-1">
                    {children}
                </div>
                <div className="hidden lg:flex w-32" />
            </div>
        </main>
    );
};