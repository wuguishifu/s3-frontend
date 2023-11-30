'use client';

import { cn } from "@/lib/utils";
import { Folders, Settings } from 'lucide-react';
import Link from "next/link";
import React from "react";
import 'remixicon/fonts/remixicon.css';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu";

export default function Navbar({ className }: { className?: string }) {
    return (
        <div className={cn(className, 'w-full flex flex-row items-center gap-8 py-3')}>
            <Link href="/" className="text-4xl font-bold text-primary hover:text-primary/90">S3C</Link>
            <div className="flex-1" />
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="w-[160px]">
                            <Link href="/buckets" className={'flex flex-row gap-2 text-lg font-medium text-primary hover:text-primary/90 justify-center items-center'}>
                                <Folders size={24} />
                                <span>Buckets</span>
                            </Link>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-[160px]">
                                <ListItem href="/buckets" title="My Buckets">
                                    View all buckets
                                </ListItem>
                                <ListItem href="/buckets/create" title="Create Bucket">
                                    Create a new bucket
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground px-4 py-2 h-10 rounded-md">
                        <Link href="/settings" className={'flex flex-row gap-2 text-lg font-medium text-primary hover:text-primary/90 justify-center'}>
                            <Settings size={24} />
                            <span>Settings</span>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div >
    );
};

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});