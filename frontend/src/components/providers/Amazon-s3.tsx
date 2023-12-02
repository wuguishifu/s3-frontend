'use client';

import React from 'react';

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from '../ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { regionGroups } from "@/lib/aws";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from 'zod';
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    region: z.string()
});

export default function AmazonS3() {
    const [open, setOpen] = React.useState(false);
    const [useKeystore, setUseKeystore] = React.useState(true); // load from db
    const [keystoreWarningOpen, setKeystoreWarningOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accessKeyId: "",
            secretAccessKey: "",
            region: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    async function onDelete() {
        console.log('delete');
    }

    React.useEffect(() => {
        if (!useKeystore) {
            setKeystoreWarningOpen(true);
        }
    }, [useKeystore]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='w-full'>Manage Settings</Button>
            </DialogTrigger>
            <DialogContent className='max-w-md px-0' onInteractOutside={e => e.preventDefault()}>
                <div className='px-6'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Amazon S3 Settings</DialogTitle>
                        <DialogDescription>Configure your Amazon S3 provider credentials.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="accessKeyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Access Key ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter your Access Key ID" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="secretAccessKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Secret Access Key</FormLabel>
                                        <FormDescription>You will no longer be able to see this once this dialog closes</FormDescription>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter your Secret Access Key" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Default Region</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select region" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {regionGroups.map(group => (
                                                        <SelectGroup key={group.label}>
                                                            <SelectLabel className="pl-4 font-bold">{group.label}</SelectLabel>
                                                            {group.regions.map(region => (
                                                                <SelectItem
                                                                    onSelect={() => form.setValue("region", region.value)}
                                                                    value={region.value}
                                                                    key={region.value}
                                                                    className="cursor-pointer"
                                                                >{region.label} {region.value}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Save</Button>
                        </form>
                    </Form>
                </div>
                <div className='px-6'>
                    <Separator />
                </div>
                <div className='px-6'>
                    <DialogHeader>
                        <DialogTitle>Keystore Settings</DialogTitle>
                    </DialogHeader>
                </div>
                <div className="flex flex-col">
                    <div className='px-6'>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="keystore-switch">
                                Enable {
                                    <Link
                                        target="_blank"
                                        href="/docs/keystore"
                                        className={cn(
                                            buttonVariants({ variant: 'link' }),
                                            'p-0'
                                        )}>
                                        Keystore
                                    </Link>
                                } for Amazon S3 (recommended)
                            </Label>
                            <div className="flex-1" />
                            <Switch id="keystore-switch" checked={useKeystore} onCheckedChange={setUseKeystore} />
                            <AlertDialog open={keystoreWarningOpen} onOpenChange={setKeystoreWarningOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>Use browser cache?</AlertDialogHeader>
                                    <AlertDialogDescription>
                                        Using the supplied keystore server is highly recommended. If you do not use the keystore, private keys will be stored in your browser's cache so you do not have to input them every time. This is dangerous, and can make your keys vulnerable to attacks. S3C is not liable for any damage caused by this action.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setUseKeystore(true)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className={buttonVariants({ variant: 'destructive' })}>Dangerously Use Browser Cache</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <Button variant="secondary">Learn more</Button>
                    </div>
                    <Accordion type='multiple'>
                        <AccordionItem value='advanced'>
                            <AccordionTrigger className='px-6'>Show Advanced Settings</AccordionTrigger>
                            <AccordionContent>
                                <div className='flex flex-col gap-4 px-6'>
                                    <div className="space-y-2">
                                        <Label htmlFor="keystore-endpoint">Keystore Endpoint</Label>
                                        <Input id="keystore-endpoint" placeholder="Enter the keystore endpoint" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="api-url">API URL</Label>
                                        <Input id="api-url" placeholder="Enter the API URL" />
                                    </div>
                                    <Button className="mt-2">Reset Settings</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className='px-6 -mt-4 space-y-4'>
                    <Separator />
                    <AlertDialog>
                        <AlertDialogTrigger className={buttonVariants({ variant: 'destructive' })}>Delete Access Keys</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>Are you sure?</AlertDialogHeader>
                            <AlertDialogDescription>
                                This will delete your access keys from the keystore and you will no longer be able to access your data through this app. The data will not be deleted, and you will be able to access it through the AWS website.
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onDelete} className={buttonVariants({ variant: 'destructive' })}>Delete Access Keys</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    );

};
