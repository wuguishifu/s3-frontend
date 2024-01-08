'use client';

import { Bucket, columns } from "@/components/bucket-table/columns";
import { DataTable } from "@/components/bucket-table/data-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { exists } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { Toaster, toast } from "sonner";
import z from 'zod';
import BucketForm from "./add-bucket";
import useCreateTemplate from "../useCreateTemplate";

import Spinner from 'react-activity/dist/Spinner';
import 'react-activity/dist/Spinner.css';

const formSchema = z.object({
    access: z.union([
        z.literal('general'),
        z.literal('restricted')
    ]),
    policies: z.object({
        CreateBucket: z.boolean(),
        DeleteBucket: z.boolean()
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
})
    .refine(data => data.access === 'general' || !(data.policies.CreateBucket || data.policies.DeleteBucket));

type FormSchema = z.infer<typeof formSchema>;

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


export default function AWSCloudFormationSetupForm() {
    const [stack, setStack] = useState<{} | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const createTemplate = useCreateTemplate();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            access: 'general',
            policies: {
                CreateBucket: false,
                DeleteBucket: false
            },
            buckets: []
        }
    });

    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [bucketDialogOpen, setBucketDialogOpen] = React.useState<boolean>(false);

    function onDownload() {
        const blob = new Blob([JSON.stringify(stack, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'cloudformation-stack.json';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }

    // TODO: add a progress bar
    async function onSubmit(values: FormSchema) {
        setLoading(true);
        let data;
        try {
            data = await createTemplate(values);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error has occurred');
            }
            return;
        } finally {
            setLoading(false);
        }
        if (data.error) {
            console.error(data);
            toast.error(data.error);
            return;
        }
        if (data.stack) {
            setStack(data.stack);
            toast.success('Configuration file created!');
        }
    }

    function onAddBucket(bucketName: string, removalPolicy: FormSchema['buckets'][number]['removalPolicy']) {
        form.setValue('buckets', [...form.getValues('buckets'), { bucketName, removalPolicy }]);
    }

    return (
        <>
            <Form {...form}>
                <Toaster richColors />
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4'>
                    <FormField
                        control={form.control}
                        name='access'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>
                                    <h2 className="my-0">Access Type</h2>
                                </FormLabel>
                                <p className='w-full opacity-50 my-0'>Using general access will allow Bucket Store to read/write in any S3 bucket in your AWS account. It will also let you create or delete buckets through Bucket Store. Using restricted access will only allow Bucket Store to read/write in specified buckets. Use restricted access if you have other S3 buckets in your AWS account that you do not want accessible through Bucket Store.</p>
                                <Select
                                    onValueChange={(value: FormSchema['access']) => {
                                        if (value === 'restricted') {
                                            form.setValue('policies.CreateBucket', false, { shouldTouch: true });
                                            form.setValue('policies.DeleteBucket', false, { shouldTouch: true });
                                        }
                                        field.onChange(value);
                                    }}
                                    defaultValue='general'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="General" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="restricted">Restricted</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <FormLabel className="w-full">
                            <h2 className="mb-0">IAM Policies</h2>
                        </FormLabel>
                        <p className='w-full opacity-50 my-0'>These are policies that define what Bucket Store is allowed to do in your AWS account. Hover over a label to see the purpose of the policy. You can see more information about IAM policies <Link href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-access-control.html" target="_blank" className="underline">here</Link>.</p>
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
                                                <FormControl>
                                                    <Checkbox
                                                        id='CreateBucket'
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={form.getValues('access') === 'restricted'}
                                                    />
                                                </FormControl>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild onClick={() => {
                                                            if (form.getValues('access') === 'restricted') return;
                                                            form.setValue('policies.CreateBucket', !field.value)
                                                        }}>
                                                            <div className={form.getValues('access') === 'restricted' ? 'opacity-50' : 'cursor-pointer'}>
                                                                CreateBucket
                                                            </div>
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
                                                <FormControl>
                                                    <Checkbox
                                                        id='DeleteBucket'
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={form.getValues('access') === 'restricted'}
                                                    />
                                                </FormControl>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild onClick={() => {
                                                            if (form.getValues('access') === 'restricted') return;
                                                            form.setValue('policies.DeleteBucket', !field.value)
                                                        }}>
                                                            <div className={form.getValues('access') === 'restricted' ? 'opacity-50' : 'cursor-pointer'}>
                                                                DeleteBucket
                                                            </div>
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
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name='buckets'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>
                                        <h2 className="mb-0">New Buckets</h2>
                                    </FormLabel>
                                    <p className='w-full opacity-50 my-0'>If you're using restricted access type, you will need to either specify buckets here or manually in your AWS account. Otherwise, Bucket Store will not be able to access any buckets within your AWS account.</p>
                                    <DataTable
                                        columns={columns()}
                                        data={field.value as Bucket[] ?? []}
                                        rowSelection={rowSelection}
                                        setRowSelection={setRowSelection}
                                    />
                                    <div className="flex flex-row items-center gap-2 justify-start">
                                        <Button type="button" onClick={() => setBucketDialogOpen(true)}>Add Bucket</Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button disabled={!form.getValues('buckets').length} variant="destructive">Clear</Button>
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
                                        {Object.keys(rowSelection).length
                                            ? <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button disabled={!Object.keys(rowSelection).length} variant="destructive">Delete Selected</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogHeader>Delete selected buckets?</AlertDialogHeader>
                                                        <AlertDialogDescription>
                                                            This will delete all selected buckets. This cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
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
                                                            }}
                                                            className={buttonVariants({ variant: 'destructive' })}>
                                                            Confirm
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            : null
                                        }
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <FormLabel className="w-full">
                            <h2 className="mb-0">Configuration File</h2>
                        </FormLabel>
                        <p className='w-full opacity-50 my-0'>Once you're done, you can click "Create Configuration File" below to download a CloudFormation template. Deploying this CloudFormation Stack in your AWS account will give you a set of keys that you can use to give Bucket Store access to your Amazon S3 Buckets according to this spec.</p>
                        <div className="w-full flex flex-col items-start py-8 gap-2">
                            <div className="w-full flex flex-row items-center gap-2">
                                <Button type="submit">Create Configuration File</Button>
                                {loading && <Spinner />}
                            </div>
                            {stack && (
                                <div className="w-full flex flex-row items-center justify-start gap-2">
                                    <Button type="button" variant="outline" onClick={onDownload}>Download</Button>
                                    <div>cloudformation-stack.json</div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </Form >
            <Dialog open={bucketDialogOpen} onOpenChange={setBucketDialogOpen}>
                <BucketForm
                    existingBucketNames={form.getValues('buckets').map(bucket => bucket.bucketName)}
                    setBucketDialogOpen={setBucketDialogOpen}
                    bucketDialogOpen={bucketDialogOpen}
                    addBucket={onAddBucket}
                />
            </Dialog>
        </>
    );
};