"use client"

import * as React from 'react';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { otpVerification, resendOtp } from '@/lib/features/learnerAuth/learnerAuthSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import DefaultLayout from '../DefaultLayout';


interface IFormInput {
    id: string | number;
    token: string;
}
const OTPVerification = () => {
    const { loading } = useAppSelector((state) => state.learnerAuth)
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>({
        defaultValues: {
            token: '',
        }
    })
    const dispatch = useAppDispatch();
    const router = useRouter();

    // function to verify a learner
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
                                    OTP Verification
                                </p>
                                <p>Verify your accounts using the six digit
                                    sent to your email
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

            </DefaultLayout>
        </>
    );
}

export default OTPVerification;
