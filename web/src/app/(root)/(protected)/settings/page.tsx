import { redirect } from 'next/navigation';

export default function Settings() {
    redirect('/settings/aws/configure');
};