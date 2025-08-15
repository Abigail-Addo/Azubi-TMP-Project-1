"use client";

import React from "react";
import DefaultLayout from "../DefaultLayout";
import { Alert, Snackbar, TextField, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateProfile } from "@/lib/features/adminAuth/adminAuthSlice";
import AlertDialog from "@/components/dialogue/AlertDialogue";
import { CiCamera } from "react-icons/ci";
import Image from "next/image";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface IFormInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    contact: string;
    token: string;
    baseResetURL: string;
    profileImage: string;
    created_at: string;
    updated_at: string;

}

const Profile = () => {
    const dispatch = useAppDispatch();
    const { adminAuth, loading } = useAppSelector((state) => state.adminAuth);

    const { handleSubmit, control, setValue, reset, formState: { errors }, watch } = useForm<IFormInput>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            contact: "",
            password: "",
            confirmPassword: "",
            profileImage: '',
        },
    });
    const password = watch('password')
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [dialogueVisible, setDialogueVisible] = React.useState(false);
    const alertRef = React.useRef<{ severity: "success" | "error"; message: string } | null>(null);
    const [preview, setPreview] = React.useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setValue("firstName", parsedUser.firstName || "");
                setValue("lastName", parsedUser.lastName || "");
                setValue("email", parsedUser.email || "");
                setValue("contact", parsedUser.contact || "");
            }
        }
    }, [setValue]);

    React.useEffect(() => {
        if (adminAuth.length > 0) {
            const admin = adminAuth[0];
            setValue("firstName", admin.firstName);
            setValue("lastName", admin.lastName);
            setValue("email", admin.email);
            setValue("contact", admin.contact);
            setPreview(admin.profileImage || null);
        }
    }, [adminAuth, setValue]);

    const handleButtonClick = () => fileInputRef.current?.click();

    const showAlert = (severity: "success" | "error", message: string) => {
        alertRef.current = { severity, message };
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 6000);
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            if (data.password) formData.append("password", data.password);
            if (data.confirmPassword) formData.append("confirmPassword", data.confirmPassword);
            if (data.contact) formData.append("contact", data.contact);
            if (selectedFile) formData.append("profileImage", selectedFile);

            const result = await dispatch(updateProfile(formData));

            if (updateProfile.fulfilled.match(result)) {
                showAlert("success", "Profile updated successfully!");
                reset();
            } else if (updateProfile.rejected.match(result)) {
                showAlert("error", result.payload as string);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unexpected error";
            showAlert("error", message);
        }
    };

    // Trigger confirmation dialog before submitting
    const handleFormSubmit = () => {
        setDialogueVisible(true);
    };

    const handleConfirm = () => {
        setDialogueVisible(false);
        handleSubmit(onSubmit)();
    };

    return (
        <>
            <Snackbar open={alertVisible} autoHideDuration={6000} onClose={() => setAlertVisible(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert severity={alertRef.current?.severity || "success"} onClose={() => setAlertVisible(false)} sx={{ width: "100%" }}>
                    {alertRef.current?.message || ""}
                </Alert>
            </Snackbar>

            <DefaultLayout>
                <div className="flex justify-center mt-10">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">

                        <form
                            onSubmit={handleSubmit(handleFormSubmit)}
                            className="space-y-4">

                            {/* Profile Picture */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <Image
                                    src={preview || "/assets/user.png"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border border-gray-300"
                                    width={100} height={100}
                                />
                                <IconButton
                                    onClick={handleButtonClick}
                                    className="absolute bottom-0 right-0 bg-white p-1 shadow-md"
                                >
                                    <CiCamera />
                                </IconButton>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setSelectedFile(file);
                                        if (file) setPreview(URL.createObjectURL(file));
                                    }}
                                />
                            </div>
                            {/* first name */}
                            <div>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{
                                        required: "Please enter a valid first name"
                                    }}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            id="firstName"
                                            label="First Name"
                                            variant="outlined"
                                            className="w-full"
                                            autoComplete="off"
                                            type="text"
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
                                {errors.firstName && (
                                    <p role="alert" className="text-red-500 text-sm">{errors.firstName.message}</p>
                                )}
                            </div>

                            {/* last name */}
                            <div>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{
                                        required: "Please enter a valid first name"
                                    }}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            id="lastname"
                                            label="Last Name"
                                            variant="outlined"
                                            className="w-full"
                                            autoComplete="off"
                                            type="text"
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
                                {errors.lastName && (
                                    <p role="alert" className="text-red-500 text-sm">{errors.lastName.message}</p>
                                )}
                            </div>

                            {/* email */}
                            <div>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: "Please enter a valid first name"
                                    }}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            id="email"
                                            label="Email"
                                            variant="outlined"
                                            className="w-full"
                                            autoComplete="off"
                                            type="text"
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

                            {/* Contact */}
                            <div>
                                <Controller
                                    name="contact"
                                    control={control}
                                    rules={{
                                        required: "Please enter a valid contact number",
                                        pattern: {
                                            value: /^[0-9]{10,15}$/,
                                            message: "Contact must be between 10 and 15 digits"
                                        }
                                    }}
                                    render={({ field }) =>
                                        <TextField
                                            {...field}
                                            id="contact"
                                            label="Contact"
                                            variant="outlined"
                                            className="w-full"
                                            autoComplete="off"
                                            type="tel"
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
                                {errors.contact && (
                                    <p role="alert" className="text-red-500 text-sm">{errors.contact.message}</p>
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

                            <div className="w-full flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-[#01589A] text-white px-5 py-2 rounded w-full transition duration-300 hover:bg-[#014273] focus:bg-[#01589a] cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </DefaultLayout>

            {dialogueVisible && <AlertDialog text="You're about to update your profile. Confirm to continue." onConfirm={handleConfirm} onCancel={() => setDialogueVisible(false)} />}
        </>
    );
};

export default Profile;
