'use client';

import Spinner from 'react-activity/dist/Spinner';
import 'react-activity/dist/Spinner.css';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from "@/lib/firebase/AuthContext";
import { LogOut, Settings } from 'lucide-react';
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function Navbar() {
    const { currentUser, hasCheckedAuth, logout } = useAuth();

    return (
        <nav className="w-full flex flex-row items-center px-4 py-2 gap-4 bg-white border-b border-slate-200">
            <Link href='/'><h1 className="m-0">Bucket Store</h1></Link>
            <div className="flex-1" />
            <Link href='/buckets' className={buttonVariants({ variant: 'ghost' })}>Buckets</Link>
            {currentUser ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="border-2 border-primary">
                            <AvatarFallback>
                                <h2>{currentUser.email?.[0].toUpperCase() ?? '?'}</h2>
                            </AvatarFallback>
                            <AvatarImage src={currentUser.photoURL ?? undefined} />
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{currentUser.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href='/settings'>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4 text-destructive" />
                            <span className='text-destructive'>Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                hasCheckedAuth
                    ? <Link href='/login' className={buttonVariants({ variant: 'default' })}>Log In</Link>
                    : <div className='w-10 h-10 flex items-center justify-center'><Spinner size={20} /></div>
            )}
        </nav>
    );
};