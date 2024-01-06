import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

export const RemovalPolicy = {
    DESTROY: { label: 'Destroy', color: 'bg-red-500' },
    RETAIN: { label: 'Retain', color: 'bg-green-500' },
    SNAPSHOT: { label: 'Snapshot', color: 'bg-blue-500' }
}

export type Bucket = {
    bucketName: string;
    removalPolicy: keyof typeof RemovalPolicy;
};

export const columns = (
    onEditBucket: (bucketName: string) => void,
    onDeleteBucket: (bucketName: string) => void
): ColumnDef<Bucket>[] => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'bucketName',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        <div className="flex flex-row items-center gap-2">
                            <p className="my-0">Bucket Name</p>
                            {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : (
                                column.getIsSorted() === 'desc' ? <ArrowUp className="h-4 w-4 transform rotate-180" />
                                    : <div className='w-4' />
                            )}
                        </div>
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className='flex flex-row items-center gap-2 pl-4'>
                    <p className='my-0'>{row.original.bucketName}</p>
                </div>
            )
        },
        {
            accessorKey: 'removalPolicy',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        <div className="flex flex-row items-center gap-2">
                            <p className="my-0">Removal Policy</p>
                            {column.getIsSorted() === 'asc' ? <ArrowUp className="h-4 w-4" /> : (
                                column.getIsSorted() === 'desc' ? <ArrowUp className="h-4 w-4 transform rotate-180" />
                                    : <div className='w-4' />
                            )}
                        </div>
                    </Button>
                );
            },
            cell: ({ row }) => {
                const { removalPolicy: policy } = row.original;
                return (
                    <div className="flex flex-row items-center gap-2 pl-4">
                        <div className={`w-3 h-3 rounded-full ${RemovalPolicy[policy].color}`} />
                        <p className="my-0">{RemovalPolicy[policy].label}</p>
                    </div>
                );
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open Menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEditBucket(row.original.bucketName)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteBucket(row.original.bucketName)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            enableSorting: false,
            enableHiding: false
        }
    ];