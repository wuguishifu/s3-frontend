'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAws } from '@/lib/firebase/CredentialsContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import Spinner from 'react-activity/dist/Spinner';
import 'react-activity/dist/Spinner.css';

const formSchema = z.object({
    accessKeyId: z.string()
        .min(1, { message: 'Please enter your AWS access key ID' })
        .max(128, { message: 'Your AWS access key ID must be less than 128 characters long' }),
    secretAccessKey: z.string()
        .min(1, { message: 'Please enter your AWS secret access key' })
        .max(128, { message: 'Your AWS secret access key must be less than 128 characters long' }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AWSCredentialsInputForm() {
    const { accessKeyId, deleteKeys, setKeys, hasCheckedCredentials } = useAws();
    const [loading, setLoading] = useState(false);

    const [secretVisible, setSecretVisible] = useState(false);
    const toggleSecretVisibility = useCallback(() => setSecretVisible(b => !b), []);

    useEffect(() => {
        if (!hasCheckedCredentials || !accessKeyId) return;
        form.setValue('accessKeyId', accessKeyId);
    }, [hasCheckedCredentials]);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accessKeyId: accessKeyId ?? '',
            secretAccessKey: ''
        },
    });

    const onDelete = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        try {
            const error = await deleteKeys();
            if (error) {
                console.error(error);
                return toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }

        toast.success('Your AWS credentials have been deleted.');
    }, [loading]);

    const onSubmit = useCallback(async (values: FormSchema) => {
        if (loading) return;
        setLoading(true);

        try {
            const error = await setKeys(values);
            if (error) {
                console.error(error);
                return toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }

        setSecretVisible(false);
        form.resetField('secretAccessKey');
        toast.success('Your AWS credentials have been saved.');
    }, [loading]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='flex items-center gap-4 w-full'>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='accessKeyId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Access Key ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={'access-key-id'} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name='secretAccessKey'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Secret Access Key</FormLabel>
                                    <div className='relative'>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={secretVisible ? 'secret-access-key' : '•••••••••••••••••'}
                                                type={secretVisible ? 'text' : 'password'}
                                            />
                                        </FormControl>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            className='absolute right-0 top-0 bottom-0 px-2 aspect-square'
                                            onClick={toggleSecretVisibility}>
                                            {secretVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
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
                                Delete Credentials
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                Delete Credentials?
                                <DialogDescription>
                                    Are you sure you want to delete your AWS credentials? This action cannot be undone. If you wish to use Bucket Store again, you will need to add your credentials again.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type='button' variant='outline'>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type='button' variant='destructive' onClick={onDelete}>
                                        Delete
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