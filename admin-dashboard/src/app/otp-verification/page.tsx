"use client"

import * as React from 'react';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { otpVerification, resendOtp } from '@/lib/features/adminAuth/adminAuthSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


interface IFormInput {
    id: string | number;
    token: string;
}
const OTPVerification = () => {
    const { loading } = useAppSelector((state) => state.adminAuth)
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>({
        defaultValues: {
            token: '',
        }
    })
    const dispatch = useAppDispatch();
    const router = useRouter();

    // function to verify an admin
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const result = await dispatch(otpVerification(data));

            if (otpVerification.fulfilled.match(result)) {
                toast.success("OTP verification successful")
                reset();
                router.push("/")
            } else if (otpVerification.rejected.match(result)) {
                toast.error(result.payload as string)
            }
        } catch (error) {
            toast.error(error as string)
        }
    };

    // function to resend otp
    const handleResendOtp = async () => {
        try {
            const result = await dispatch(resendOtp());

            if (resendOtp.fulfilled.match(result)) {
                toast.success("OTP resent");
            } else if (resendOtp.rejected.match(result)) {
                toast.error(result.payload as string);
            }
        } catch (error) {
            toast.error(error as string);
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
                    <div className='h-fit lg:w-2/5 md:w-3/4 bg-white rounded-lg lg:shadow-lg overflow-y-scroll px-6 py-8 md:px-8 md:py-10'>
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
                                <h2 className="text-xl font-bold text-gray-800 md:text-2xl">OTP Verification</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Enter the verification code we sent to your email
                                </p>
                            </div>

                            {/* code */}
                            <div>
                                <Controller
                                    name="token"
                                    control={control}
                                    rules={{
                                        required: "Please enter otp code",
                                        pattern: {
                                            value: /\d+/,
                                            message: "Only digits are allowed in this field"
                                        },
                                    }}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            id="outlined-basic"
                                            label="Code"
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
                                {errors.token && (
                                    <p role="alert" className="text-red-500 text-sm">{errors.token.message}</p>
                                )}
                            </div>

                            {/* button */}
                            <div className="w-full flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Verify'}
                                </button>
                            </div>
                            <p className='text-center'>Didn&apos;t receive an otp?
                                <span
                                    onClick={handleResendOtp}
                                    className='text-[#01589A] cursor-pointer hover:underline'
                                >
                                    Resend OTP
                                </span>
                            </p>
                        </form>
                    </div>
                </div >
            </main >
        </>
    );
}

export default OTPVerification;
