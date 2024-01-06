import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Link href="/setup/aws" className={buttonVariants({ variant: 'default' })}>To AWS Config</Link>
        </main>
    );
};