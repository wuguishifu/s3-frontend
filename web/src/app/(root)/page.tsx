'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/AuthContext";
import Link from "next/link";

export default function Home() {
    const { logout } = useAuth();

    return (
        <main>
            <Link href={'/setup/aws'} className={buttonVariants({ variant: 'default' })}>Aws Setup</Link>
            <Button onClick={logout}>Log Out</Button>
        </main>
    );
};