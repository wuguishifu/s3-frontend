import { Bucket, columns } from "@/components/bucket-table/columns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, exists } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
// import { save } from '@tauri-apps/api/dialog';
// import { writeTextFile } from "@tauri-apps/api/fs";
// import { downloadDir } from '@tauri-apps/api/path';
import { DataTable } from "@/components/bucket-table/data-table";
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const formSchema = z.object({
    access: z.union([
        z.literal('general'),
        z.literal('restricted')
    ]),
    policies: z.object({
        CreateBucket: z.boolean(),
        DeleteBucket: z.boolean(),
    }),
    buckets: z.array(
        z.object({
            bucketName: z.string(),
            removalPolicy: z.union([
                z.literal('DESTROY'),
                z.literal('RETAIN'),
                z.literal('SNAPSHOT')
            ])
        })
    )
}).refine(data => {
    if (data.access === 'restricted') {
        return !data.policies.CreateBucket && !data.policies.DeleteBucket;
    }
});

type FormType = z.infer<typeof formSchema>;

const tooltips = {
    ListBucket: 'Used to list all items in a folder.',
    GetObject: 'Used to get a specific file.',
    PutObject: 'Used to upload a file.',
    DeleteObject: 'Used to delete a file.',
    ListAllMyBuckets: 'Used to list all folders.',
    GetBucketWebsite: 'Used to get an access point URL for a specific bucket. This is required because buckets with specified URL endpoints are only accessible through them.',
    CreateBucket: 'Used to create root level folders.',
    DeleteBucket: 'Used to delete root level folders.'
};

// const suggestedFileName = 'Bucket Builder CFN.yaml';

export function Setup() {
    // async function onSave() {
    //     const filePath = await save({
    //         defaultPath: (await downloadDir()) + '/' + suggestedFileName
    //     });

    //     if (!filePath) {
    //         return;
    //     }

    //     await writeTextFile(filePath, 'hello: world');
    // }

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            access: 'general',
            policies: {
                CreateBucket: false,
                DeleteBucket: false,
            },
            buckets: []
        }
    });

    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

    function onSubmit(values: FormType) {
        console.log('submitting')
        console.log(values);
    }

    function onEditBucket(bucketName: string) {
        console.log('edit', bucketName)
    }

    function onDeleteBucket(bucketName: string) {
        const index = form.getValues('buckets').findIndex(bucket => bucket.bucketName === bucketName);
        const copy = [...form.getValues('buckets')];
        copy.splice(index, 1);
        form.setValue('buckets', copy);
        setRowSelection(p => {
            const copy = { ...p };
            delete copy[`${index}`];
            return copy;
        });
    }

    return (
        <main className="flex justify-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="absolute top-0 left-0">
                        <Link className={cn(buttonVariants({ variant: "ghost" }))} to="/"><ChevronLeft /></Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="my-0">back</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="max-w-screen-md px-4 w-full items-center flex flex-col">
                <h1 className="text-center">Setup</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4 w-2/3'>
                        <FormField
                            control={form.control}
                            name='access'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <TooltipProvider>
                                        <FormLabel>
                                            <Tooltip>
                                                <TooltipTrigger>Access Type</TooltipTrigger>
                                                <TooltipContent>
                                                    <p className='my-0 max-w-96'>General access will allow access to all buckets in your AWS account. Restricted access will only allow access to specified buckets.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                    </TooltipProvider>
                                    <Select
                                        onValueChange={(value: FormType['access']) => {
                                            if (value === 'restricted') {
                                                form.setValue('policies.CreateBucket', false, { shouldTouch: true });
                                                form.setValue('policies.DeleteBucket', false, { shouldTouch: true });
                                            }
                                            field.onChange(value);
                                        }}
                                        defaultValue='general'>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="restricted">Restricted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormLabel className='w-full'>IAM Policies</FormLabel>
                        <div className='flex flex-row w-full'>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-center gap-2'>
                                    <Checkbox disabled checked />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <label className='opacity-50 cursor-pointer'>ListBucket</label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>{tooltips.ListBucket}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className='flex flex-row items-center gap-2'>
                                    <Checkbox disabled checked />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <label className='opacity-50 cursor-pointer'>GetObject</label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>{tooltips.GetObject}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className='flex flex-row items-center gap-2'>
                                    <Checkbox disabled checked />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <label className='opacity-50 cursor-pointer'>PutObject</label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>{tooltips.PutObject}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className='flex flex-row items-center gap-2'>
                                    <Checkbox disabled checked />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <label className='opacity-50 cursor-pointer'>DeleteObject</label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>{tooltips.DeleteObject}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <div className='flex flex-row items-center gap-2'>
                                    <Checkbox disabled checked />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <label className='opacity-50 cursor-pointer'>ListAllMyBuckets</label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>{tooltips.ListAllMyBuckets}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className='flex flex-row items-center gap-2'>
                                    <Checkbox disabled checked />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <label className='opacity-50 cursor-pointer'>GetBucketWebsite</label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>{tooltips.GetBucketWebsite}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <FormField
                                    control={form.control}
                                    name='policies.CreateBucket'
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <div className='flex flex-row items-center gap-2 cursor-pointer'>
                                                <Checkbox
                                                    id='CreateBucket'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={form.getValues('access') === 'restricted'}
                                                />
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <label
                                                                htmlFor='CreateBucket'
                                                                className={form.getValues('access') === 'restricted' ? 'opacity-50' : 'cursor-pointer'}>
                                                                CreateBucket
                                                            </label>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className='my-0 max-w-96'>{tooltips.CreateBucket}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='policies.DeleteBucket'
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <div className='flex flex-row items-center gap-2 cursor-pointer'>
                                                <Checkbox
                                                    id='DeleteBucket'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={form.getValues('access') === 'restricted'}
                                                />
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <label
                                                                htmlFor='DeleteBucket'
                                                                className={form.getValues('access') === 'restricted' ? 'opacity-50' : 'cursor-pointer'}>
                                                                DeleteBucket
                                                            </label>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className='my-0 max-w-96'>{tooltips.DeleteBucket}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name='buckets'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <FormLabel className='cursor-pointer'>New Buckets (optional)</FormLabel>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className='my-0 max-w-96'>If you're using restricted access, you can specify new buckets to add access to here.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <div className="flex flex-row items-center gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>Add Bucket</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Bucket</DialogTitle>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button onClick={() => {
                                                            form.setValue(
                                                                'buckets',
                                                                [...form.getValues('buckets'), { bucketName: 'test', removalPolicy: 'DESTROY' }]
                                                            );
                                                        }}>
                                                            Add Bucket
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <div className="flex-1" />
                                        <Button
                                            variant="destructive"
                                            disabled={!Object.keys(rowSelection).length}
                                            onClick={() => {
                                                form.setValue(
                                                    'buckets',
                                                    form
                                                        .getValues('buckets')
                                                        .map((bucket, index) => {
                                                            if (`${index}` in rowSelection) return null
                                                            return bucket;
                                                        })
                                                        .filter(exists)
                                                );
                                                setRowSelection({});
                                            }}>
                                            Delete Selected
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">Clear</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogHeader>Clear new buckets?</AlertDialogHeader>
                                                    <AlertDialogDescription>
                                                        This will clear all new buckets. This cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => {
                                                            form.setValue('buckets', []);
                                                            setRowSelection({});
                                                        }}
                                                        className={buttonVariants({ variant: 'destructive' })}>
                                                        Confirm
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <DataTable
                                        columns={columns(onEditBucket, onDeleteBucket)}
                                        data={field.value as Bucket[] ?? []}
                                        rowSelection={rowSelection}
                                        setRowSelection={setRowSelection}
                                    />
                                </FormItem>
                            )}
                        />
                        <p className='w-full'>Tip: hover over a label to see the purpose of the field.</p>
                    </form>
                </Form>
            </div>
        </main>
    );
};