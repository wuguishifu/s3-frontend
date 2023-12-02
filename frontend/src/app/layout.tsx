import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/navbar'
import ProviderTree from './providers';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'S3C',
    description: 'Created by Bo Bramer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.className}>
                <ProviderTree>
                    <div className='flex flex-col h-full px-4 min-h-screen'>
                        <Navbar />
                        {children}
                    </div>
                </ProviderTree>
            </body>
        </html>
    );
};
