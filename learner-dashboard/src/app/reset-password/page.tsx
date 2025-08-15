"use client"

import * as React from 'react';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { forgotPassword } from '@/lib/features/learnerAuth/learnerAuthSlice';
import { toast } from 'react-toastify';
import DefaultLayout from '../DefaultLayout';

interface IFormInput {
    id: string | number;
    email: string;
    baseResetURL: string;
}
const ResetPassword = () => {
    const { loading } = useAppSelector((state) => state.learnerAuth);
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
            <DefaultLayout>
                <div className="grid grid-cols-2 container mx-auto">
                    {/* image */}
                    <div className=''>
                        <Image
                            src="/assets/regHero.png"
                            alt="Logo Small"
                            width={1000}
                            height={1000}
                            className=" w-full h-full"
                            priority
                        />
                    </div>
                    {/* form */}
                    <div className='h-full w-full px-6 py-8 md:px-8 md:py-10 flex items-center justify-center'>
                        {!successMessage ? (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="w-3/4 space-y-8"
                            >
                                {/* title */}
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-800 md:text-3xl pb-3">
                                        Forgot password
                                    </p>
                                    <p>Enter your email address to reset your password</p>
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

            </DefaultLayout>
        </>
    );
}

export default ResetPassword;
