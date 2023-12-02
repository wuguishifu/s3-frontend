'use client';

import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-between p-24">
            <Button onClick={() => signIn()}>log in</Button>
            <Button onClick={() => signOut()}>log out</Button>
        </main>
    );
};