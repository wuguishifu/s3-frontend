import { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Bucket Store | Settings'
};

export default function Settings() {
    redirect('/settings/general');
};