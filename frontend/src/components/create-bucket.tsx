"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import React from 'react';
import { useForm } from "react-hook-form";
import z from 'zod';
import { Input } from "./ui/input";

const regionGroups = [
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
]

const formSchema = z.object({
    bucketName: z.string()
        .min(3, { message: "Bucket name must be at least 3 characters long." })
        .max(63, { message: "Bucket name must be at most 63 characters long." })
        .refine(bucketName => bucketName.match(/^[a-z0-9.-]+$/), { message: "Bucket name must only contain lower case letters, periods, and hyphens." })
        .refine(bucketName => !bucketName.startsWith("xn--"), { message: "Bucket name cannot start with xn--." })
        .refine(bucketName => !bucketName.includes(".."), { message: "Bucket name cannot contain two adjacent periods." })
        .refine(bucketName => bucketName.match(/^[a-z0-9]/), { message: "Bucket name must begin with a letter or number." })
        .refine(bucketName => !bucketName.match(/^\d+\.\d+\.\d+\.\d+$/), { message: "Bucket name cannot be formatted as an IP address." })
        .refine(bucketName => !bucketName.startsWith("sthree-"), { message: "Bucket name cannot start with sthree-." })
        .refine(bucketName => !bucketName.startsWith("sthree-configurator"), { message: "Bucket name cannot start with sthree-configurator." })
        .refine(bucketName => !bucketName.endsWith("-s3alias"), { message: "Bucket name cannot end with -s3alias." })
        .refine(bucketName => !bucketName.endsWith("--ol-s3"), { message: "Bucket name cannot end with --ol-s3." }),
    region: z.string()
        .min(1, { message: "Region is required." })
});

export default function CreateBucket() {
    const [open, setOpen] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bucketName: "",
            region: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    React.useEffect(() => void (open && form.reset()), [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Create Bucket</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Bucket</DialogTitle>
                    <DialogDescription>
                        Create a new Bucket. You will be charged by AWS for the storage and bandwidth usage. You can have at most 100 buckets.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region (required)</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="region" />
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
                                    <FormDescription>
                                        The AWS region where the bucket will be created.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bucketName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bucket Name (required)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Bucket names must be unique across all existing bucket names in Amazon S3. Bucket names must comply with DNS naming conventions.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Create Bucket</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );

};