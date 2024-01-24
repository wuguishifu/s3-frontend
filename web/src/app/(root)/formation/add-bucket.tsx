import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
    bucketName: z.string()
        .min(3, { message: 'Bucket name must be at least 3 characters long.' })
        .max(63, { message: 'Bucket name must be at most 63 characters long.' })
        .refine(bucketName => bucketName.match(/^[a-z0-9.-]+$/), { message: 'Bucket name must only contain lowercase letters, numbers, periods, and hyphens.' })
        .refine(bucketName => !bucketName.startsWith('xn--'), { message: 'Bucket name cannot start with "xn--".' })
        .refine(bucketName => !bucketName.includes(".."), { message: 'Bucket name cannot contain two adjacent periods.' })
        .refine(bucketName => bucketName.match(/^[a-z0-9]/), { message: 'Bucket name must begin with a letter or number.' })
        .refine(bucketName => !bucketName.match(/^\d+\.\d+\.\d+\.\d+$/), { message: 'Bucket name cannot be formatted as an IP address.' })
        .refine(bucketName => !bucketName.startsWith("sthree-"), { message: 'Bucket name cannot start with "sthree-".' })
        .refine(bucketName => !bucketName.startsWith("sthree-configurator"), { message: 'Bucket name cannot start with "sthree-configurator".' })
        .refine(bucketName => !bucketName.endsWith("-s3alias"), { message: 'Bucket name cannot end with "-s3alias".' })
        .refine(bucketName => !bucketName.endsWith("--ol-s3"), { message: 'Bucket name cannot end with "--ol-s3".' }),
    removalPolicy: z.union([
        z.literal('DESTROY'),
        z.literal('RETAIN'),
        z.literal('SNAPSHOT')
    ])
});

type FormSchema = z.infer<typeof formSchema>;

type BucketFormProps = {
    existingBucketNames: string[];
    setBucketDialogOpen: (open: boolean) => void;
    bucketDialogOpen: boolean;
    addBucket: (bucketName: string, removalPolicy: FormSchema['removalPolicy']) => void;
};

export default function BucketForm({
    existingBucketNames,
    setBucketDialogOpen,
    bucketDialogOpen,
    addBucket,
}: BucketFormProps) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bucketName: '',
            removalPolicy: 'RETAIN'
        }
    });

    function onSubmit(values: FormSchema) {
        if (existingBucketNames.includes(values.bucketName)) {
            form.setError('bucketName', {
                type: 'manual',
                message: 'Bucket name must be unique.'
            });
            return;
        }
        addBucket(values.bucketName, values.removalPolicy);
        setBucketDialogOpen(false);
    }

    useEffect(() => {
        if (bucketDialogOpen === true) form.reset();
    }, [bucketDialogOpen]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Bucket</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4'>
                    <FormField
                        control={form.control}
                        name='bucketName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bucket Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='my-bucket'
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    This is your bucket's name. It must be unique across all of AWS. It must also be between 3 and 63 characters long, and can only contain lowercase letters, numbers, periods, and hyphens. See more about bucket naming rules <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html" target="_blank" rel="noopener noreferrer" className='underline'>here</a>.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='removalPolicy'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Removal Policy</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue='RETAIN'>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='DESTROY'>Destroy</SelectItem>
                                        <SelectItem value='RETAIN'>Retain</SelectItem>
                                        <SelectItem value='SNAPSHOT'>Snapshot</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    This is the removal policy for your bucket. You can learn more about what the different policies do <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html" target="_blank" rel="noopener noreferrer" className='underline'>here</a>.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className='w-full flex flex-row justify-end gap-4'>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type='submit' variant='default'>Add Bucket</Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    );
};