'use client';

import { Button, buttonVariants } from "@/components/ui/button";
import { endpoints } from "@/lib/endpoints";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Link href="/setup/aws" className={buttonVariants({ variant: 'default' })}>To AWS Config</Link>
            <Button onClick={() => {
                fetch(endpoints.auth.authenticate)
                    .then(response => response.json())
                    .then(response => console.log(response));
            }}>
                test authentication
            </Button>
        </main>
    );
};