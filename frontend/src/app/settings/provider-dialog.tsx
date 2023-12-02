'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label, labelVariants } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from 'react';

export type ProviderSettingsDef = {
    name: string;
    description: string;
    fields: {
        [key: string]: ProviderField;
    }
};

export type ProviderField = ProviderFieldInput | ProviderFieldCustom;

export type ProviderFieldBase = {
    name: string;
    description?: string;
};

export type ProviderFieldInput = ProviderFieldBase & {
    placeholder: string;
    keystoreEndpoint?: string;
    button?: {
        text: string;
        onClick: () => void;
    }
};

export type ProviderFieldCustom = ProviderFieldBase & {
    component: (props: { state: string; setState: (value: string) => void }) => React.ReactNode;
};

export type ProviderState<T extends ProviderSettingsDef> = {
    [key in keyof T['fields']]: string;
};

export default function ProviderDialog<T extends ProviderSettingsDef>({ providerDef, onSave }: {
    providerDef: T,
    onSave: (state: ProviderState<T>) => Promise<boolean>;
}): React.ReactNode {
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState<ProviderState<T>>(
        Object.fromEntries(Object.entries(providerDef.fields).map(
            ([key, field]) => [key, 'defaultValue' in field ? field.defaultValue ?? '' : '']
        )) as ProviderState<T>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='w-full'>Manage Settings</Button>
            </DialogTrigger>
            <DialogContent className='max-w-md' onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>{providerDef.name}</DialogTitle>
                    <DialogDescription>{providerDef.description}</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    {Object.entries(providerDef.fields).map(([key, field]) => (
                        <div key={key}>
                            {'component' in field ? (
                                <field.component
                                    state={state[key]}
                                    setState={(value: string) => setState({ ...state, [key]: value })}
                                />
                            ) : (
                                <ProviderFieldInputComponent
                                    state={state[key]}
                                    setState={(value: string) => setState({ ...state, [key]: value })}
                                    field={field}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <div className='flex flex-row items-center gap-4'>
                        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => onSave(state).then(shouldClose => shouldClose && setOpen(false))}>Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

function ProviderFieldInputComponent({ state, setState, field }: {
    state: string;
    setState: (value: string) => void;
    field: ProviderFieldInput;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
                id={field.name}
                placeholder={field.placeholder}
                value={state}
                onChange={(e) => setState(e.target.value)}
            />
            {field.description && <div className={cn(labelVariants(), 'text-primary/70')}>{field.description}</div>}
        </div>
    );
};

// export const AmazonS3ProviderDef = {
//     name: 'Amazon S3',
//     description: 'Configure your Amazon S3 provider credentials.',
//     fields: {
//         accessKeyId: {
//             name: 'Access Key ID',
//             placeholder: 'Enter your Access Key ID',
//         },
//         secretAccessKey: {
//             name: 'Secret Access Key',
//             placeholder: 'Enter your Secret Access Key',
//             description: 'You won\'t be able to see this again after you close this dialog.',
//         },
//         defaultRegion: {
//             name: 'Default AWS Region',
//             component: ({ setState }: { state: string; setState: (value: string) => void }) => (
//                 <Select onValueChange={setState}>
//                     <SelectTrigger>
//                         <SelectValue placeholder="region" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {regionGroups.map(group => (
//                             <SelectGroup key={group.label}>
//                                 <SelectLabel className="pl-4 font-bold">{group.label}</SelectLabel>
//                                 {group.regions.map(region => (
//                                     <SelectItem
//                                         value={region.value}
//                                         key={region.value}
//                                         className="cursor-pointer"
//                                     >{region.label} {region.value}</SelectItem>
//                                 ))}
//                             </SelectGroup>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             )
//         }
//     }
// }

// export default function AmazonS3() {
//     return <ProviderDialog providerDef={AmazonS3ProviderDef} onSave={async (state) => {
//         console.log(state);
//         return true;
//     }} />
// };