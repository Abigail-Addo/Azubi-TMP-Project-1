"use client"

import React from "react"
import DefaultLayout from "../DefaultLayout"
import {
    TextField,
    InputAdornment,
    MenuItem,
    Button,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import {
    FaBook,
    FaEnvelope,
    FaLock,
    FaMapMarkerAlt,
    FaPhone,
    FaUser,
    FaVenusMars,
} from "react-icons/fa"

interface FormValues {
    name: string
    email: string
    course: string
    gender: string
    phone: string
    location: string
    password: string
    description: string
    amount: string
}

const Checkout = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            email: "",
            course: "",
            gender: "",
            phone: "",
            location: "",
            password: "",
            description: "",
            amount: "350",
        },
    })

    const onSubmit = (data: FormValues) => {
        console.log("Form Data:", data)
    }

    return (
        <DefaultLayout>
            {/* Header */}
            <div className="bg-[#01589A] h-64 flex items-center justify-center text-white text-3xl">
                <h1>Checkout</h1>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="container mx-auto py-20 grid grid-cols-2 gap-8"
            >
                {/* Left Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaUser className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Please enter a valid email",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    autoComplete="off"
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaEnvelope className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Course */}
                    <div>
                        <Controller
                            name="course"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Course"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaBook className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Gender"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaVenusMars className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaPhone className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Location"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaMapMarkerAlt className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Password is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    type="password"
                                    fullWidth
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
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FaLock className="text-gray-500" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            )}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    multiline
                                    rows={3}
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
                            )}
                        />
                    </div>
                </div>

                {/* Right: Payment Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Complete payment
                    </h2>
                    <p className="text-2xl font-bold">$ 350.00 USD</p>

                    <div>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Select amount"
                                    fullWidth
                                    size="small"
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
                                    <MenuItem value="100">100</MenuItem>
                                    <MenuItem value="200">200</MenuItem>
                                    <MenuItem value="350">350</MenuItem>
                                </TextField>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        Complete my purchase →
                    </Button>
                </div>
            </form>
        </DefaultLayout>
    )
}

export default Checkout
