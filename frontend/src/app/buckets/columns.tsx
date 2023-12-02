"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export type Bucket = {
    name: string,
    created_at: string,
    region: string,
};

export const columns: ColumnDef<Bucket>[] = [
    {
        id: "select",
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
            <div className='h-8 flex flex-col items-center justify-center'>
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className='h-8 flex flex-col items-center justify-center'>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            </div>
        )
    },
    {
        header: ({ column }) => (
            <div
                className='flex flex-row items-center cursor-pointer select-none py-2'
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <span className='font-bold'>Bucket Name</span>
                {column.getIsSorted() === "asc" && <ArrowUp className='ml-2 h-4 w-4' />}
                {column.getIsSorted() === "desc" && <ArrowDown className='ml-2 h-4 w-4' />}
                {column.getIsSorted() === false && <ArrowUpDown className='ml-2 h-4 w-4' />}
            </div>
        ),
        cell: ({ row }) => {
            const router = useRouter();
            const name = row.getValue<string>('name');

            return (
                <Button variant="link" onClick={() => router.push(`/buckets/${name}`)}>
                    {name}
                </Button>
            );
        },
        accessorKey: 'name',
    },
    {
        header: ({ column }) => (
            <div
                className='flex flex-row items-center cursor-pointer select-none py-2'
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <span className='font-bold'>Created At</span>
                {column.getIsSorted() === "asc" && <ArrowUp className='ml-2 h-4 w-4' />}
                {column.getIsSorted() === "desc" && <ArrowDown className='ml-2 h-4 w-4' />}
                {column.getIsSorted() === false && <ArrowUpDown className='ml-2 h-4 w-4' />}
            </div>
        ),
        accessorKey: 'created_at',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return date.toLocaleString();
        }
    },
    {
        header: () => <div className='font-bold'>Region</div>,
        accessorKey: 'region',
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const bucket = row.original;
            const [open, setOpen] = React.useState(false);

            const onDelete = React.useCallback(async (): Promise<{ status: number, data: any }> => {
                console.log('delete', bucket.name);
                return { status: 500, data: { error: "not implemented" } };
            }, []);

            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bucket.name)}>
                                Copy bucket name
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DialogTrigger className='w-full'>
                                <DropdownMenuItem>
                                    <div className='text-destructive'>Delete bucket</div>
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Bucket</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the bucket <span className='font-bold'>{bucket.name}</span>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <div className='flex flex-row gap-4'>
                                <Button variant='destructive' onClick={() => onDelete()
                                    .then(({ status, data }) => {
                                        if (status > 299) {
                                            console.error(data);
                                            return;
                                        }
                                        setOpen(false);
                                    })
                                }>Delete</Button>
                                <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        }
    }
];