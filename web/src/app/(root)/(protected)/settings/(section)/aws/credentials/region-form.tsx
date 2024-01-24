'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAws } from '@/lib/firebase/CredentialsContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import Spinner from 'react-activity/dist/Spinner';
import 'react-activity/dist/Spinner.css';

const REGION_GROUPS = [
    {
        label: "United States",
        regions: [
            { value: "us-east-1", label: "US East (N. Virginia)" },
            { value: "us-east-2", label: "US East (Ohio)" },
            { value: "us-west-1", label: "US West (N. California)" },
            { value: "us-west-2", label: "US West (Oregon)" },
        ]
    },
    {
        label: "Europe",
        regions: [
            { value: "eu-central-1", label: "Europe (Frankfurt)" },
            { value: "eu-west-1", label: "Europe (Ireland)" },
            { value: "eu-west-2", label: "Europe (London)" },
            { value: "eu-west-3", label: "Europe (Paris)" },
            { value: "eu-north-1", label: "Europe (Stockholm)" }
        ]
    }
];

const formSchema = z.object({
    defaultRegion: z.string()
        .min(1, { message: 'Please select a default region' })
        .refine(value => REGION_GROUPS.some(group => group.regions.some(region => region.value === value)), { message: 'Please select a valid region' })
});

type FormSchema = z.infer<typeof formSchema>;

export default function AWSDefaultRegionInputForm() {
    const { hasCheckedCredentials, defaultRegion, setDefaultRegion, resetDefaultRegion } = useAws();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!hasCheckedCredentials || !defaultRegion || defaultRegion === 'us-east-1') return;
        form.setValue('defaultRegion', defaultRegion);
    }, [hasCheckedCredentials]);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            defaultRegion: defaultRegion ?? 'us-east-1'
        }
    });

    const onReset = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        try {
            const error = await resetDefaultRegion();
            if (error) {
                console.error(error);
                return toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }

        toast.success('Default region deleted');
        form.setValue('defaultRegion', 'us-east-1');
    }, [loading]);

    const onSubmit = useCallback(async (value: FormSchema) => {
        if (loading) return;
        setLoading(true);

        try {
            const error = await setDefaultRegion(value.defaultRegion);
            if (error) {
                console.error(error);
                return toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }

        toast.success('Default region updated');
        form.setValue('defaultRegion', value.defaultRegion);
    }, [loading]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='flex items-center gap-4 w-full'>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='defaultRegion'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Region</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='US East (N. Virginia) us-east-1' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {REGION_GROUPS.map(group => (
                                                    <SelectGroup key={group.label}>
                                                        <SelectLabel className='pl-4 font-bold'>{group.label}</SelectLabel>
                                                        {group.regions.map(region => (
                                                            <SelectItem
                                                                key={region.value}
                                                                value={region.value}
                                                                onSelect={() => form.setValue('defaultRegion', region.value)}
                                                                className='cursor-pointer'>
                                                                {region.label} {region.value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1' />
                </div>
                <div className='flex flex-row gap-4 items-center'>
                    <Button
                        disabled={loading}
                        type='submit'
                        className='w-36'
                        variant='default'>
                        Save
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                disabled={loading}
                                type='button'
                                className='w-36'
                                variant='destructive'>
                                Reset
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                Reset Default Region?
                                <DialogDescription>
                                    This will reset your default region to 'us-east-1'. This will not delete any of your existing buckets, but it will change the region that is initially loaded when you visit the app.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type='button' variant='outline'>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type='button' variant='destructive' onClick={onReset}>
                                        Reset
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {loading && <Spinner />}
                </div>
            </form>
        </Form>
    );
};