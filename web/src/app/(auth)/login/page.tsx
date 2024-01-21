'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import FormSeparator from '@/components/ui/form-separator';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/firebase/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
    const router = useRouter();

    const { login, signInWithGoogle } = useAuth();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    async function onSubmit(values: FormSchema) {
        try {
            await login(values.email, values.password);
            toast.success('Logged in successfully.');
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
                        form.setError('email', { message: 'Incorrect email or password.' });
                        break;
                    case AuthErrorCodes.USER_DISABLED:
                        form.setError('email', { message: 'account disabled.' });
                        break;
                    default:
                        toast.error(error.code);
                        break;
                }
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred.');
            }
        }
    }

    async function googleLogin() {
        try {
            await signInWithGoogle();
            toast.success('Logged in successfully.');
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case AuthErrorCodes.POPUP_CLOSED_BY_USER:
                        toast.info('Popup closed by user.');
                        break;
                    default:
                        toast.error(error.code);
                        break;
                }
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred.');
            }
        }
    }

    return (
        <main className='w-full h-full flex items-center justify-center'>
            <div className='w-[886px] h-[648px] rounded-xl overflow-hidden flex flex-row items-center float'>
                <div className='flex flex-col items-center justify-center overflow-hidden flex-[532] h-full bg-white'>
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
                            {/* TODO: forgot password reset email */}
                            {/* <Link href='/forgot-password' className='hover:underline underline-offset-4'>Forgot your password?</Link> */}
                            <div className='h-4' />
                            <Button type='submit'>Log In</Button>
                            <FormSeparator label='or' />
                            <Button type='button' variant='secondary' onClick={googleLogin}>Log In with Google</Button>
                            <p className='m-0'>Need an account?{' '}
                                <Link className='hover:underline underline-offset-4' href='/signup'>
                                    Sign up.
                                </Link>
                            </p>
                        </form>
                    </Form>
                </div>
                <div className="flex flex-col h-full relative flex-[334]" style={{ backgroundColor: '#cbe1ff' }}>
                    <img src='/login.svg' style={{ position: 'absolute', overflow: 'hidden', right: -110, top: 235, width: 531, height: 317 }} className="max-w-none max-h-none" alt='login graphic' />
                </div>
            </div>
        </main>
    );
};