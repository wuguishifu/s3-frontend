import { endpoints } from '@/lib/api/endpoints';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import FormSeparator from '@/components/ui/form-separator';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
    email: z.string()
        .email({ message: 'please enter a valid email address.' }),
    password: z.string()
        .min(6, { message: 'must be at least 6 characters.' })
        .max(128, { message: 'must be at most 128 characters.' }),
})

type FormSchema = z.infer<typeof formSchema>;

export default function LogIn() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setPasswordVisible(b => !b);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    async function onSubmit(values: FormSchema) {
        console.log('on log in', values);
    }

    return (
        <main className='w-full h-full flex items-center justify-center'>
            <div
                className='flex flex-col items-center justify-center rounded-xl overflow-hidden w-[532px] h-[648px]'
                style={{ boxShadow: '0 0 53px 4px rgba(0, 0, 0, 0.07)' }}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='w-[310px] flex flex-col gap-4'>
                        <h1 className='text-center'>log in</h1>
                        <div className='h-4' />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex flex-row items-center'>
                                        <FormLabel className='leading-1'>Email {form.formState.errors.email && <> - {form.formState.errors.email.message}</>}</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder='mikey@gmail.com'
                                            autoComplete='on'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex flex-row items-center'>
                                        <FormLabel className='leading-1'>Password {form.formState.errors.password && <> - {form.formState.errors.password.message}</>}</FormLabel>
                                    </div>
                                    <div className='relative'>
                                        <FormControl>
                                            <Input
                                                placeholder={passwordVisible ? 'password' : '••••••••'}
                                                autoComplete='on'
                                                type={passwordVisible ? 'text' : 'password'}
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            className='absolute right-0 top-0 bottom-0 px-2 aspect-square'
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className='h-4' />
                        <Button type='submit'>Log In</Button>
                        <FormSeparator label='or' />
                        <Link
                            className={buttonVariants({ variant: 'secondary' })}
                            href={'/auth/signup'}>
                            Sign Up
                        </Link>
                    </form>
                </Form>
            </div>
        </main>
    );
};