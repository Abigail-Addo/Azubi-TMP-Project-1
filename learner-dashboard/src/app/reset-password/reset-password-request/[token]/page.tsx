"use client"

import * as React from 'react';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { resetPassword } from '@/lib/features/learnerAuth/learnerAuthSlice';
import { toast } from 'react-toastify';
import DefaultLayout from '@/app/DefaultLayout';

interface IFormInput {
    id: string | number;
    password: string;
    confirmPassword: string;
}
const ResetPasswordRequest = () => {
    const { loading } = useAppSelector((state) => state.learnerAuth)
    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<IFormInput>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        }
    })
    const password = watch("password")
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useParams();
    const token = params?.token as string;

    // function to reset password
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const result = await dispatch(resetPassword({
                ...data,
                token,
            }));
            if (resetPassword.fulfilled.match(result)) {
                toast.success('Password updated')
                reset();
                router.push('/login')
            } else if (resetPassword.rejected.match(result)) {
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
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="w-3/4 space-y-8"
                        >
                            {/* title */}
                            <div className="text-center">
                                <p className="text-xl font-bold text-gray-800 md:text-3xl pb-3">
                                    Reset password
                                </p>
                                <p>Create a new password and get started</p>
                            </div>

                            {/* Password Field */}
                            <div>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                                            message:
                                                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth variant="outlined" size='small'
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
                                        >
                                            <InputLabel>Password</InputLabel>
                                            <OutlinedInput
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                        </FormControl>
                                    )}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: "Confirm your password",
                                        validate: value => value === password || "Passwords do not match"
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth variant="outlined" size='small'
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
                                        >
                                            <InputLabel>Confirm Password</InputLabel>
                                            <OutlinedInput
                                                {...field}
                                                type={showConfirmPassword ? "text" : "password"}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Confirm Password"
                                            />
                                        </FormControl>
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <p role="alert" className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* button */}
                            <div className="w-full flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Send'}
                                </button>
                            </div>

                            <p className='text-center'>Back to homepage,
                                <Link href="/login" className='text-[#01589A]'>Back</Link>
                            </p>
                        </form>
                    </div>
                </div >

            </DefaultLayout>
        </>
    );
}

export default ResetPasswordRequest;
