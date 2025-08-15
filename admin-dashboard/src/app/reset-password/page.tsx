"use client"

import * as React from 'react';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { forgotPassword } from '@/lib/features/adminAuth/adminAuthSlice';
import { toast } from 'react-toastify';

interface IFormInput {
    id: string | number;
    email: string;
    baseResetURL: string;
}
const ResetPassword = () => {
    const { loading } = useAppSelector((state) => state.adminAuth);
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>({
        defaultValues: {
            email: '',
        }
    })
    const dispatch = useAppDispatch();
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);


    // function to reset password
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const payload = {
                ...data,
                baseResetURL: "http://localhost:3000/reset-password/reset-password-request"
            }
            const result = await dispatch(forgotPassword(payload));
            if (forgotPassword.fulfilled.match(result)) {
                const message = "An email has been sent to continue the process";
                toast.success("Done");
                reset();
                setSuccessMessage(message);
            } else if (forgotPassword.rejected.match(result)) {
                toast.error(result.payload as string)
            }
        } catch (error) {
            toast.error(error as string)
        }
    };

    return (
        <>
            <main className='w-screen h-screen relative'>
                {/* hero image */}
                <div className="absolute inset-0 -z-10 hidden lg:flex">
                    <Image
                        src="/assets/hero.png"
                        alt="hero"
                        fill
                        className="object-cover w-full h-full"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#D9D9D9] opacity-30" />
                </div>

                {/* form */}
                <div className="flex justify-center items-center h-full w-full px-4 overflow-y-scroll">
                    <div className='h-fit lg:w-2/5 md:w-3/4 w-full bg-white rounded-lg lg:shadow-lg overflow-y-scroll px-6 py-8 md:px-8 md:py-10'>
                        {!successMessage ? (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className=" w-full space-y-6"
                            >

                                {/* logo */}
                                <div className="flex justify-center">
                                    {/* Small screen logo */}
                                    <Image
                                        src="/logo/logo-mobile.png"
                                        alt="Logo Small"
                                        width={100}
                                        height={40}
                                        className="block md:hidden w-auto h-auto"
                                        priority
                                    />
                                    {/* Medium screen logo */}
                                    <Image
                                        src="/logo/logo-tablet.png"
                                        alt="Logo Medium"
                                        width={100}
                                        height={30}
                                        className="hidden md:block lg:hidden w-auto h-auto"
                                        priority
                                    />
                                    {/* Large screen logo */}
                                    <Image
                                        src="/logo/logo-tablet.png"
                                        alt="Logo Large"
                                        width={100}
                                        height={40}
                                        className="hidden lg:block w-auto h-auto"
                                        priority
                                    />
                                </div>

                                {/* title */}
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-800 md:text-2xl">Admin Reset Password</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Enter your email to reset your password
                                    </p>
                                </div>

                                {/* email */}
                                <div>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Please enter a valid email",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email address",
                                            }
                                        }}
                                        render={({ field }) =>
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Email"
                                                variant="outlined"
                                                className="w-full"
                                                autoComplete="off"
                                                type="text"
                                                size='small'
                                                sx={{
                                                    '& .MuiInputLabel-root.Mui-focused ': {
                                                        color: '#01589A',
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        '&:hover fieldset': {
                                                            borderColor: '#01589A',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#01589A',
                                                        },
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                    {errors.email && (
                                        <p role="alert" className="text-red-500 text-sm">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* button */}
                                <div className="w-full flex justify-center">
                                    <button
                                        type="submit"
                                        className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Reset Password'}
                                    </button>
                                </div>

                                <p className='text-center'>Back to homepage,
                                    <Link href="/signup" className='text-[#01589A]'>Back</Link>
                                </p>
                            </form>
                        ) : (
                            <div className="space-y-6 text-center">
                                <h2 className="text-lg italic">{successMessage}</h2>
                                <Link
                                    href="/login"
                                    className="inline-block bg-[#01589A] text-white px-6 py-2 rounded hover:bg-[#014273] transition"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div >
            </main >
        </>
    );
}

export default ResetPassword;
