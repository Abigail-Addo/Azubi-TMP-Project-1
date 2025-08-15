"use client"

import * as React from 'react';
import Image from 'next/image';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/features/learnerAuth/learnerAuthSlice';
import { toast } from 'react-toastify';
import DefaultLayout from '../DefaultLayout';

interface IFormInput {
    id: string | number;
    email: string;
    password: string;
}
const Login = () => {
    const { loading } = useAppSelector((state) => state.learnerAuth)
    const { control, handleSubmit, formState: { errors }, reset } = useForm<IFormInput>({
        defaultValues: {
            email: '',
            password: '',
        }
    })
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = React.useState(false);

    // function to log in an learner
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const result = await dispatch(login(data));
            if (login.fulfilled.match(result)) {
                toast.success("Login successful")
                reset();
                router.push('/')
            } else if (login.rejected.match(result)) {
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
                                <p className="text-xl font-bold text-gray-800 md:text-3xl">
                                    Log in to continue your learning journey
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
                                {errors.password && (<p className="text-red-500 text-sm">{errors.password.message}</p>)}
                                <Link href='/reset-password' className='text-[#01589A]'>forgot password?</Link>
                            </div>

                            {/* button */}
                            <div className="w-full flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Login'}
                                </button>
                            </div>

                            <p className='text-center'>Need to create an account yet?
                                <Link href="/signup" className='text-[#01589A]'>Signup</Link>
                            </p>
                        </form>
                    </div>
                </div >

            </DefaultLayout>
        </>
    );
}

export default Login;
